
import Molecule from '../molecule.js'

import Button from '../../atoms/button/button.js'
import Input from '../../atoms/input/input.js'

export default function Searchbar (options) {
    Molecule.call(this, options)

    const defaults = {
        selector: '.searchbar',
        scope: document
    }

    this.options = Object.assign({}, defaults, options)

    this.childScope = this.options.scope.querySelector(this.options.selector)


    this.searchbarButton = new Button({
        selector: '.searchbar-button',
        scope: this.childScope
    })
    this.searchbarButton.subscribe('click', this)


    this.searchbarInput = new Input({
        selector: '.searchbar-input',
        scope: this.childScope
    })
    this.searchbarInput.subscribe('change', this)
}

Searchbar.prototype = Object.create(Molecule.prototype)
Searchbar.prototype.constructor = Searchbar

// TODO: implement custom notify function
