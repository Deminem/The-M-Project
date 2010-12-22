// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: �2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      27.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/* Available transitions for page changes */
M.TRANSITION = {};
M.TRANSITION.NONE = 'none';
M.TRANSITION.SLIDE = 'slide';
M.TRANSITION.SLIDEUP = 'slideup';
M.TRANSITION.SLIDEDOWN = 'slidedown';
M.TRANSITION.POP = 'pop';
M.TRANSITION.FADE = 'fade';
M.TRANSITION.FLIP = 'flip';

m_require('core/foundation/observable.js');

/**
 * @class
 *
 * The root class for every controller.
 *
 * Controllers, respectively their properties, are observables. Views can observe them.
 *
 * @extends M.Object
 */
M.Controller = M.Object.extend(
/** @scope M.Controller.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.Controller',

    /**
     * Makes the controller's properties observable.
     */
    observable: M.Observable.extend({}),

    /**
     * Helper function to build the location href for the view to be displayed.
     *
     * @param {String} id The id of the new target.
     */
    buildLocationHref: function(id) {
        return location.pathname + '#' + id;
    },

    /**
     * Returns the class property behind the given key and informs its observers.
     *
     * @param {Object, String} page The page to be displayed or its name.
     * @param {String} transition The transition that should be used. Default: horizontal slide
     * @param {Boolean} isBack YES will cause a reverse-direction transition. Default: NO
     * @param {Boolean} changeLoc Update the browser history. Default: YES
     */
    switchToPage: function(page, transition, isBack, changeLoc) {
        page = page && page.type === 'M.PageView' ? page : M.Application.viewManager.getPage(page);
        var id = page && page.id ? page.id : null;
        var isTabBarViewTopPage = NO;

        if(id) {
            if(page.hasTabBarView) {
                if(page.tabBarView.childViews) {
                    var tabItemViews = $.trim(page.tabBarView.childViews).split(' ');
                    for(var i in tabItemViews) {
                        var tabItemView = page.tabBarView[tabItemViews[i]];
                        if(M.ViewManager.getPage(tabItemView.page) === page) {
                            page.tabBarView.setActiveTab(tabItemView.page, M.Application.viewManager.getIdByView(tabItemView));
                            isTabBarViewTopPage = YES;
                        }
                    }
                }
            }
            /* If the new page is a real tabBarViewPage (has a tabBarView and is no sub view), use no transition. */
            if(isTabBarViewTopPage) {
                transition = page.tabBarView.transition ? page.tabBarView.transition : M.TRANSITION.NONE;
                isBack = NO;
                changeLoc = changeLoc !== undefined ? changeLoc : NO;
            } else {
                transition = transition ? transition : M.TRANSITION.SLIDE;
                isBack = isBack !== undefined ? isBack : NO;
                changeLoc = changeLoc !== undefined ? changeLoc : YES;
            }

            /* Now do the page change by using a jquery mobile method and pass the properties */
            $.mobile.changePage(id, M.Application.useTransitions ? transition : M.TRANSITION.NONE, M.Application.useTransitions ? isBack : NO, changeLoc);

            /* Save the current page in the view manager */
            M.Application.viewManager.setCurrentPage(page);
        } else {
            M.Logger.log('"' + page + '" not found', M.WARN);
        }
    },

    /**
     * Returns the class property behind the given key and informs its observers.
     *
     * @param {String} key The key of the property to be changed.
     * @param {Object, String} value The value to be set.
     */
    set: function(key, value) {
        this[key] = value;
        this.observable.notifyObservers(key);
    }

});