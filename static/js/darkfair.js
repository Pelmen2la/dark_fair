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
        roleTpl =
            '<li data-role-name="{0}">' +
                '<img src="/images/darkfair/fool.png"/>' +
                '<div class="name-cnt">' +
                    '<span>{0}</span>' +
                '</div>' +
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
        scrollHandlerTimeoutId,
        navArrowScrollIntervalId;

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

        var questionAnswerList = utils.gBID('QuestionAnswerList'),
            answer = questionAnswerList.querySelector('input:checked').value,
            answers = getAnswers();
        this.setAttribute('disabled', true);
        answers.push(answer);
        setLocalStorageData('answers', answers);
        if(answers.length === window.questionListData.length) {
            setLocalStorageData('answers', []);
            setLocalStorageData('recommendedRoles', ['warrior']);
            location.replace('/roles');
        } else {
            utils.blinkElementClass(questionAnswerList, 'blink', 1000);
            utils.blinkElementClass(utils.gBID('QuestionTextCnt'), 'blink', 1000);
            window.setTimeout(ensureActiveQuestion, 400);
        }
    };

    function setRolesPageState(selectedRole, recommendedRoles) {
        var textEl = utils.gBID('RecommendedRoleText'),
            recommendedRoleList = utils.gBID('RecommendedRoleList'),
            roleInfoCnt = utils.gBID('RoleInfoCnt'),
            rolesList = utils.gBID('RoleList'),
            buyTicketBtn = utils.gBID('BuyTicketBtn');
        utils.setElementHidden(textEl, !recommendedRoles);
        utils.setElementHidden(recommendedRoleList, !recommendedRoles);
        utils.setElementHidden(roleInfoCnt, !selectedRole);
        utils.setElementHidden(buyTicketBtn, !selectedRole);
        if(recommendedRoles) {
            recommendedRoleList.innerHTML = recommendedRoles.map((r) => {
                return utils.stringFormat(roleTpl, r.name)
            }).join('');
        } else if(selectedRole) {
            roleInfoCnt.querySelector('b.name').innerHTML = selectedRole.name;
            roleInfoCnt.querySelector('p.description').innerHTML = selectedRole.description;
            for(var li, i = 0; li = rolesList.children[i]; i++) {
                utils.toggleElementClass(li.dataset.roleName === selectedRole.name, li, 'selected');
            }
        }
    };

    function onMenuCntClick(e) {
        if(['B', 'DIV'].indexOf(e.target.tagName) > -1) {
            var isOpened = this.className.indexOf('opened') > -1;
            utils.toggleElementClass(!isOpened, this, 'opened');
            utils.toggleElementClass(isOpened, this, 'closed');
        }
    };

    function onRoleBlockClick(e) {
        var el = e.target;
        while(el && !el.dataset.roleName) {
            el = el.parentNode;
        }
        if(!el) {
            return;
        }
        setRolesPageState(window.roleListData.filter((r) => r.name == el.dataset.roleName)[0], null);
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

    function onNavArrowMouseDown() {
        navArrowScrollIntervalId = window.setInterval(() => {
            var isUp = this.className.indexOf('up') > -1,
                mainCnt = utils.gBID('MainContainer');
            mainCnt.scrollTop += 20 * (isUp ? -1 : 1);
        }, 25);
    };
    
    function onNavArrowMouseLostFocus() {
        window.clearInterval(navArrowScrollIntervalId);
    };

    function initIndexPage() {
        utils.gBID('MainContainer').addEventListener('scroll', onMainCntScroll);
        ['up', 'down'].forEach((name) => {
            document.querySelector('.navigation-arrow.' + name).addEventListener('mousedown', onNavArrowMouseDown);
            document.querySelector('.navigation-arrow.' + name).addEventListener('mouseup', onNavArrowMouseLostFocus);
            document.querySelector('.navigation-arrow.' + name).addEventListener('mouseout', onNavArrowMouseLostFocus);
        });
    };

    function initRoleInterviewPage() {
        renderQuestions();
        ensureActiveQuestion();
        utils.gBID('AcceptQuestionBtn').addEventListener('click', onAcceptAnswerBtnClick);
    };

    function initRolesPage() {
        var recommendedRoleNames = getLocalStorageData('recommendedRoles');
        if(recommendedRoleNames) {
            var recommendedRoles = window.roleListData.filter((r) => recommendedRoleNames.indexOf(r.name) > -1);
            setRolesPageState(null, recommendedRoles);
        } else {
            setRolesPageState(window.roleListData[0], null);
        }
        utils.gBID('RoleBlock').addEventListener('click', onRoleBlockClick);
    };

    function initPaymentPage() {
        TinyDatePicker('#CalendarCnt', datePickerCfg);
    };

    me.init = function() {
        utils.gBID('MenuContainer').addEventListener('click', onMenuCntClick);
        if(window.pageName === 'index') {
            initIndexPage();
        } else if(window.pageName === 'role_interview') {
            initRoleInterviewPage();
        } else if(window.pageName === 'roles') {
            initRolesPage();
        } else if(window.pageName === 'payment') {
            initPaymentPage();
        }
    };
};

darkfairModule.init();