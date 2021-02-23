import {capitalize} from '@core/utils';

export class DomListener {
    constructor($root, listeners = [], name) {
        if (!$root) {
            throw new Error(`No $root!`)
        }
        this.$root = $root
        this.listeners = listeners
        this.name = name
    }
    initDomListener() {
        this.listeners.forEach(listener => {
            const method = getMethodName(listener)
            this[method] = this[method].bind()
            this.$root.on(listener, this[method])
        })
    }
    removeDomListener() {
        this.listeners.forEach(listener => {
            const method = getMethodName(listener)
            this.$root.off(listener, this[method])
        })
    }
}

function getMethodName(eventName) {
    return 'on' + capitalize(eventName)
}
