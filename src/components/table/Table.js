import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {$} from '@core/dom';

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown']
        });
    }

    toHTML() {
        return createTable(20)
    }
    onMousedown(event) {
        if (event.target.dataset.resize) {
            const $resizer = $(event.target)
            const $parent = $resizer.closest('[data-type="resizable"]')
            const coords = $parent.getCoords()
            const type = $resizer.data.resize
            const side = type === 'col' ? 'bottom' : 'right'
            let delta
            $resizer.css({
                opacity: 1,
                zIndex: 1000,
                [side]: '-5000px'
            })
            const cells = this.$root.findAll(`[data-col="${$parent.data.col}"]`)
            document.onmousemove = e => {
                if (type === 'col') {
                    delta = e.pageX - coords.right
                    $resizer.css({right: -delta + 'px'})
                } else {
                    delta = e.pageY - coords.bottom
                    $resizer.css({bottom: -delta + 'px'})
                }
            }
            document.onmouseup = () => {
                document.onmousemove = null
                document.onmouseup = null
                if (type === 'col') {
                    $parent.css({width: (coords.width + delta) + 'px'})
                    cells.forEach(el => el.style.width = (coords.width + delta) + 'px')
                } else {
                    $parent.css({height: (coords.height + delta) + 'px'})
                }
                $resizer.css({
                    opacity: 0,
                    bottom: 0,
                    right: 0
                })
            }
        }
    }
}
