import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners, options.name)
    }
    /**
     * return component template
     * @return {string}
     */
    toHTML() {
        return ''
    }
    init() {
        this.initDomListener()
    }
    destroy() {
        this.removeDomListener()
    }
}
