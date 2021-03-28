import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {$} from '@core/dom';
import {TableSelection} from '@/components/table/Table-selection';
import {range} from '@core/utils';

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown', 'keydown', 'input'],
            ...options
        });
    }

    toHTML() {
        return createTable(20)
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init() {
        super.init()

        const $cell = this.$root.find('[data-id="0:0"]')
        this.selection.select($cell)
        this.$on('formula:input', text => {
            this.selection.current.text(text)
        })
        this.$on('formula:done', () => {
            this.selection.current.focus()
        })
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
        } else if (event.target.dataset.type === 'cell') {
            const $target = $(event.target)
            if (event.shiftKey) {
                const target = $target.id(true)
                const current = this.selection.current.id(true)

                const cols = range(current.col, target.col)
                const rows = range(current.row, target.row)

                const ids = cols.reduce((acc, col) => {
                    rows.forEach(row => acc.push(`${row}:${col}`))
                    return acc
                }, [])
                const $cells = ids.map(id => this.$root.find(`[data-id="${id}"]`))
                this.selection.selectGroup($cells)
            } else {
                this.selection.select($target)
            }
        }
    }
    onKeydown(event) {
        const keys = ['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']
        if (keys.includes(event.key) && !event.shiftKey) {
            event.preventDefault()
            const id = this.selection.current.id(true)
            const $next = this.$root.find(nextSelector(event.key, id))
            this.selection.select($next)
            this.$emit('table:select', $next)
        }
    }
    onInput(event) {
        this.$emit('table:input', $(event.target))
    }
}

function nextSelector(key, {col, row}) {
    switch (key) {
        case 'Enter':
        case 'ArrowDown':
            row++
            break
        case 'Tab':
        case 'ArrowRight':
            col++
            break
        case 'ArrowLeft':
            col = col - 1 < 0 ? 0 : col -1
            break
        case 'ArrowUp':
            row = row - 1 < 0 ? 0 : row -1
            break
    }
    return `[data-id="${row}:${col}"]`
}
