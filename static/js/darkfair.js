import utils from './common/utils.js';
import './../scss/darkfair.scss';
import TinyDatePicker from 'tiny-date-picker';
import './../../node_modules/tiny-date-picker/tiny-date-picker.min.css';

var darkfairModule = new function() {
    const answerTpl =
            '<li>' +
                '<input id="{0}" type="radio" name="polling" value="{1}">' +
                '<label for="{0}">{2}</label>' +
            '</li>',
        datePickerCfg = {
            mode: 'dp-permanent',
            dayOffset: 1,
            min: new Date(),
            lang: {
                days: ['Воскр', 'Пон', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                months: [
                    'Январь',
                    'Февраль',
                    'Март',
                    'Апрель',
                    'Май',
                    'Июнь',
                    'Июль',
                    'Август',
                    'Сентябрь',
                    'Октябрь',
                    'Ноябрь',
                    'Декабрь',
                ],
                today: 'Сегодня',
                clear: 'Очистить',
                close: 'Закрыть'
            },
        };
    var me = this,
        scrollHandlerTimeoutId;

    function renderQuestions() {
        utils.gBID('QuestionList').innerHTML = window.questionListData.map((q, i) => {
            return utils.stringFormat('<li>{0}</li>', i + 1);
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
            utils.toggleElementClass(i <= index, list.children[i], 'active');
        }
        utils.gBID('QuestionTextCnt').innerHTML = question.text;
        utils.gBID('QuestionAnswerList').innerHTML = question.answers.map((a, i) => {
            return utils.stringFormat(answerTpl, 'option' + i, i, a)
        }).join('');
        addListenersToAnswerRadiobuttons();
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
        scrollMainCtn(block.getBoundingClientRect().top);
    };

    function scrollMainCtn(scrollVal) {
        utils.gBID('MainContainer').scrollTop += scrollVal;
    };

    function ensureActiveQuestion() {
        setActiveQuestion(getAnswers().length);
    };

    function addListenersToAnswerRadiobuttons() {
        utils.gBID('QuestionAnswerList').querySelectorAll('input').forEach((b) => {
            b.addEventListener('click', () => {
                utils.gBID('AcceptQuestionBtn').removeAttribute('disabled');
            });
        });
    };

    function onAcceptAnswerBtnClick() {
        if(this.getAttribute('disabled')) {
            return;
        }

        var answer = utils.gBID('QuestionAnswerList').querySelector('input:checked').value,
            answers = getAnswers();
        this.setAttribute('disabled', true);
        answers.push(answer);
        setLocalStorageData('answers', answers);
        if(answers.length === window.questionListData.length) {
            setLocalStorageData('answers', []);
            highlightRoles([window.roleListData[0]]);
            scrollToBlock('role');
        }
        ensureActiveQuestion();
    };
    
    function onMenuCntClick(e) {
        if(['B', 'DIV'].indexOf(e.target.tagName) > -1) {
            var isOpened = this.className.indexOf('opened') > -1;
            utils.toggleElementClass(!isOpened, this, 'opened');
            utils.toggleElementClass(isOpened, this, 'closed');
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

    function onMainCntScroll() {
        window.clearTimeout(scrollHandlerTimeoutId);
        scrollHandlerTimeoutId = window.setTimeout(function() {
            var cnt = utils.gBID('MainContainer'),
                upArrow = document.querySelector('.navigation-arrow.up'),
                downArrow = document.querySelector('.navigation-arrow.down');
            utils.toggleElementClass(cnt.scrollTop > 300, upArrow, 'visible');
            utils.toggleElementClass(cnt.scrollHeight - document.body.offsetHeight - cnt.scrollTop > 300, downArrow, 'visible');
        }, 100);
    };

    function onNavArrowClick() {
        var isUp = this.className.indexOf('up') > - 1,
            mainCnt = utils.gBID('MainContainer'),
            targetOffset = isUp ? 0 : mainCnt.scrollHeight,
            scrollTop = mainCnt.scrollTop;
        document.querySelectorAll('.main-block').forEach((b) => {
            var scrollDiff = b.offsetTop - scrollTop;
            if(isUp && scrollDiff < 0 && scrollDiff < (scrollTop - targetOffset)) {
                targetOffset = b.offsetTop;
            }
            if(!isUp && scrollDiff > 0 && scrollDiff < (targetOffset - scrollTop)) {
                targetOffset = b.offsetTop;
            }
        });
        mainCnt.scrollTop = targetOffset;
    };

    me.init = function() {
        renderQuestions();
        ensureActiveQuestion();
        selectRole(window.roleListData[0]);
        utils.gBID('MenuContainer').addEventListener('click', onMenuCntClick);
        utils.gBID('RoleBlock').addEventListener('click', onRoleBlockClick);
        utils.gBID('MainContainer').addEventListener('scroll', onMainCntScroll);
        utils.gBID('AcceptQuestionBtn').addEventListener('click', onAcceptAnswerBtnClick);
        ['up', 'down'].forEach((name) => {
            document.querySelector('.navigation-arrow.' + name).addEventListener('click', onNavArrowClick);
        });
        TinyDatePicker('#CalendarCnt', datePickerCfg);
    };
};

darkfairModule.init();