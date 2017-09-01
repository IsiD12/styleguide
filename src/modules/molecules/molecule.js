
import Atom from '../atoms/atom.js'


export default function Molecule (options) {
    Atom.call(this, options)

    const defaults = {
        selector: 'body',
        scope: document
    }

    this.options = Object.assign({}, defaults, options)
}

Molecule.prototype = Object.create(Atom.prototype)
Molecule.prototype.constructor = Molecule

Molecule.prototype.notify = function (module, eventType) {
    const self = this
    const selector = self.options.selector

    console.info(selector, 'got', eventType, 'Event from', module.options.selector)
}