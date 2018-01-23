import utils from './../common/utils.js';
import './../../scss/admin/app.scss';

var adminAppModule = new function() {
    var me = this,
        questionInputTpl = '<input type="text" placeholder="Текст вопроса" value="{0}">';

    function getSurveyForm() {
        return utils.gBID('NewSurveyForm');
    };
    
    function getQuestionsCnt() {
        return utils.gBID('QuestionsCnt');
    };

    function getSurveyNameInput() {
        return utils.gBID('SurveyNameInput');
    };

    function setSurveyFormVisibility(isVisible) {
        utils[isVisible ? 'removeClassFromElement' : 'addClassToElement'](getSurveyForm(), 'hidden');
    };

    function populateSurveyForm(data) {
        getSurveyNameInput().value = '';
        getQuestionsCnt().innerHTML = data.map((q) => utils.stringFormat(questionInputTpl, q.text)).join('<br>');
    };

    function populateSurveyCnt(data) {
        utils.createRequest('/survey_names', 'GET', null, function(data) {
            utils.gBID('SurveysCnt').innerHTML = data.map((entry) => {
                return utils.stringFormat('{0} - {1}', entry.id, entry.name || 'Без имени');
            }).join('<br>');
        });
    };

    function onAddNewSurveyBtnClick() {
        setSurveyFormVisibility(true);
        populateSurveyForm([{text: ''}]);
    };

    function onCloseSurveyFormBtnClick() {
        utils.addClassToElement(getSurveyForm(), 'hidden');
    };

    function onSaveSurveyBtnClick() {
        var inputs = getQuestionsCnt().querySelectorAll('input[type=text]'),
            questions = [];
        inputs.forEach((i) => questions.push({text: i.value}));
        var data = {
            name: getSurveyNameInput().value,
            questions: questions
        };
        utils.createRequest('/admin/surveys', 'POST', data, () => {
            setSurveyFormVisibility(false);
            populateSurveyCnt()
        });
    };
    
    function onAddQuestionBtnClick() {
        getQuestionsCnt().append(utils.createElementFromHTML(utils.stringFormat(questionInputTpl, '')));
    };

    me.init = function() {
        utils.gBID('AddNewSurveyBtn').onclick = onAddNewSurveyBtnClick;
        utils.gBID('SaveSurveyBtn').onclick = onSaveSurveyBtnClick;
        utils.gBID('AddQuestionBtn').onclick = onAddQuestionBtnClick;
        utils.gBID('CloseSurveyFormBtn').onclick = onCloseSurveyFormBtnClick;
        populateSurveyCnt();
    };
};

adminAppModule.init();