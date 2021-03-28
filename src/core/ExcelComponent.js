import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners, options.name)
        this.emmiter = options.emmiter
        this.unsubscriber = []
        this.prepare()
    }
    prepare() {}

    toHTML() {
        return ''
    }
    $emit(event, ...args) {
        this.emmiter.emit(event, ...args)
    }
    $on(event, fn) {
        const unsub = this.emmiter.subscribe(event, fn)
        this.unsubscriber.push(unsub)
    }
    init() {
        this.initDomListener()
    }
    destroy() {
        this.removeDomListener()
        this.unsubscriber.forEach(unsub => unsub())
    }
}
