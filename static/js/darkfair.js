import utils from './common/utils.js';
import './../scss/darkfair.scss';

var darkfairModule = new function() {
    const answerTpl =
            '<li>' +
                '<input id="{0}" type="radio" name="polling" value="{1}">' +
                '<div class="check">' +
                    '<div class="inside"></div>' +
                '</div>' +
                '<label for="{0}">{2}</label>' +
            '</li>';
    var me = this;

    function renderQuestions() {
        utils.gBID('QuestionList').innerHTML = window.questionListData.map((q, i) => {
            return utils.stringFormat('<li class="card disabled">{0}</li>', i + 1);
        }).join('');
    };
    
    function getLocalStorageData(propName) {
        return JSON.parse(localStorage.getItem(propName));
    };

    function setLocalStorageData(propName, val) {
        localStorage.setItem(propName, JSON.stringify(val));
    };

    function getAnswers() {
        return getLocalStorageData('answers') || [];
    };

    function setActiveQuestion(index) {
        var question = window.questionListData[index];
        for(var i = 0; i <= index; i++) {
            var list = utils.gBID('QuestionList');
            utils.removeClassFromElement(list.children[i], 'disabled');
        }
        utils.gBID('QuestionTextCnt').innerHTML = question.text;
        utils.gBID('QuestionAnswerList').innerHTML = question.answers.map((a, i) => {
            return utils.stringFormat(answerTpl, 'option' + i, i, a)
        }).join('');
        addListenersToAnswerRadiobuttons(onAnswerRadiobuttonClick);
    };

    function ensureActiveQuestion() {
        setActiveQuestion(getAnswers().length);
    }

    function addListenersToAnswerRadiobuttons(fn) {
        utils.gBID('QuestionAnswerList').querySelectorAll('input').forEach((b) => {
            b.addEventListener('click', fn)
        });
    };

    function onAnswerRadiobuttonClick(e) {
        var val = arguments[0].target.value,
            answers = getAnswers();
        answers.push(val);
        setLocalStorageData('answers', answers);
        ensureActiveQuestion();
    };
    
    function onMenuCntClick(e) {
        if(['IMG', 'B'].indexOf(e.target.tagName) > -1) {
            var isOpened = this.className.indexOf('opened') > -1;
            utils[isOpened ? 'removeClassFromElement' : 'addClassToElement'](this, 'opened');
        }
        if(e.target.dataset.blockName) {
            var block = utils.gBID(utils.capitalizeString(e.target.dataset.blockName) + 'Block');
            utils.gBID('MainContainer').scrollTop += block.getBoundingClientRect().top;
        }
    };

    me.init = function() {
        renderQuestions();
        ensureActiveQuestion();
        utils.gBID('MenuContainer').addEventListener('click', onMenuCntClick);
    };
};

darkfairModule.init();