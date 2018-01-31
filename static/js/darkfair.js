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
            return utils.stringFormat('<li class="disabled">{0}</li>', i + 1);
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
        var questions = window.questionListData,
            question = questions[index];
        for(var i = 0; i < questions.length; i++) {
            var list = utils.gBID('QuestionList');
            utils.toggleElementClass(i > index, list.children[i], 'disabled');
        }
        utils.gBID('QuestionTextCnt').innerHTML = question.text;
        utils.gBID('QuestionAnswerList').innerHTML = question.answers.map((a, i) => {
            return utils.stringFormat(answerTpl, 'option' + i, i, a)
        }).join('');
        addListenersToAnswerRadiobuttons(onAnswerRadiobuttonClick);
    };

    function selectRole(role) {
        var infoCnt = utils.gBID('RoleInfoCnt'),
            rolesList = utils.gBID('RoleList');
        infoCnt.querySelector('b.name').innerHTML = role.name;
        infoCnt.querySelector('p.description').innerHTML = role.description;
        for(var li, i = 0; li = rolesList.children[i]; i++) {
            utils.toggleElementClass(li.dataset.roleName === role.name, li, 'selected');
        }
    };

    function highlightRoles(roles) {
        var rolesList = utils.gBID('RoleList');
        for(var li, i = 0; li = rolesList.children[i]; i++) {
            var role = roles.filter((r) => r.name === li.dataset.roleName)[0];
            utils.toggleElementClass(!!role, li, 'highlighted');
        }
    };

    function scrollToBlock(blockName) {
        var block = utils.gBID(utils.capitalizeString(blockName) + 'Block');
        utils.gBID('MainContainer').scrollTop += block.getBoundingClientRect().top;
    };

    function ensureActiveQuestion() {
        setActiveQuestion(getAnswers().length);
    };

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
        if(answers.length === window.questionListData.length) {
            setLocalStorageData('answers', []);
            highlightRoles([window.roleListData[0]]);
            scrollToBlock('role');
        }
        ensureActiveQuestion();
    };
    
    function onMenuCntClick(e) {
        if(['IMG', 'B'].indexOf(e.target.tagName) > -1) {
            var isOpened = this.className.indexOf('opened') > -1;
            utils[isOpened ? 'removeClassFromElement' : 'addClassToElement'](this, 'opened');
        }
        e.target.dataset.blockName && scrollToBlock(e.target.dataset.blockName);
    };

    function onRoleBlockClick(e) {
        var el = e.target;
        while(el && !el.dataset.roleName) {
            el = el.parentNode;
        }
        if(!el) {
            return;
        }
        selectRole(window.roleListData.filter((r) => r.name == el.dataset.roleName)[0]);
    };

    me.init = function() {
        renderQuestions();
        ensureActiveQuestion();
        selectRole(window.roleListData[0]);
        utils.gBID('MenuContainer').addEventListener('click', onMenuCntClick);
        utils.gBID('RoleBlock').addEventListener('click', onRoleBlockClick);
    };
};

darkfairModule.init();