
const $window = $(window);
const $wrapper = $("div.wrapper");
const $main = $("main");
const $sidebarAndContent = $("#sidebar, #content");
const $buttonSidebarCollapse = $("button#sidebar-collapse");

/**
 * Render template, substitute placeholders with elements from `data` object.
 * Example:
 * ```render('<a href="${url}">x</a>', {"url": "http://foo.com"}) -> <a href="http://foo.com">x</a>
 * Idea from https://stackoverflow.com/a/39065147
 **/
function renderTemplate(template, data) {
    function _render(props) {
        return function (tok, i) {
            return (i % 2) ? props[tok] : tok;
        };
    }

    let parsedTpl = template.split(/\$\{(.+?)\}/g);
    return parsedTpl.map(_render(data)).join('');
}

/**
 * For large screens show both language columns adjacently.
 * For small screens show columns only for the language selected
 * in `#lang-switch`
 **/
function adaptSectionColumns() {
    if ($window.width() >= 576) {
        $("div.section-vernacular").show();
        $("div.section-latin").show();
    } else {
        let langId = $("#lang-switch>input.active>input").attr("id");
        if (langId == "lang-switch-vernacular") {
            $("div.section-vernacular").show();
            $("div.section-latin").hide();
        }
        if (langId == "lang-switch-latin") {
            $("div.section-latin").show();
            $("div.section-vernacular").hide();
        }
    }
}

/**
 * Switch between lang versions on small screens, where the switch is visible
 **/
function toggleLangSections(input) {
    if (input.id == "lang-switch-vernacular") {
        $("div.section-vernacular").show();
        $("div.section-latin").hide();
    } if (input.id == "lang-switch-latin") {
        $("div.section-latin").show();
        $("div.section-vernacular").hide();
    }
}

function navbarIsCollapsed() {
    return $buttonSidebarCollapse.is(":visible");
}


$window.on("load", function () {
    /**
     * Toggle sidebar on hamburger menu click ..
     **/
    $("#sidebar-collapse").on("click", function () {
        $sidebarAndContent.toggleClass("active");
    });

    /**
     * .. and on swipe ..
     **/
    let sidebarTouchXPos = 0;
    $wrapper.on("touchstart", function (e) {
        sidebarTouchXPos = e.originalEvent.touches[0].pageX;
    }).on("touchend", function (e) {
        if (navbarIsCollapsed()) {
            if ((sidebarTouchXPos - e.originalEvent.changedTouches[0].pageX > 80 && $sidebarAndContent.hasClass("active")) ||
                (sidebarTouchXPos - e.originalEvent.changedTouches[0].pageX < -80 && !$sidebarAndContent.hasClass("active"))) {
                $sidebarAndContent.toggleClass("active");
            }
        }
    });

    /**
     * .. and close it on touch in the main area in small view
     **/
    $main.on("touchstart", function (e) {
        if (navbarIsCollapsed()) {
            $sidebarAndContent.removeClass("active");
        }
    });

});