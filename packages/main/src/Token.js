import Bootstrap from "@ui5/webcomponents-base/src/Bootstrap.js";
import UI5Element from "@ui5/webcomponents-base/src/UI5Element.js";
import litRender from "@ui5/webcomponents-base/src/renderer/LitRenderer.js";
import { getTheme } from "@ui5/webcomponents-base/src/Configuration.js";
import {
	isBackSpace,
	isEnter,
	isSpace,
	isDelete,
} from "@ui5/webcomponents-base/src/events/PseudoEvents.js";

import Icon from "./Icon.js";
import TokenTemplate from "./build/compiled/TokenTemplate.lit.js";

// Styles
import styles from "./themes/Token.css.js";

// all themes should work via the convenience import (inlined now, switch to json when elements can be imported individyally)
import "./ThemePropertiesProvider.js";

/**
 * @public
 */
const metadata = {
	tag: "ui5-token",
	defaultSlot: "text",
	usesNodeText: true,
	slots: /** @lends sap.ui.webcomponents.main.Token.prototype */ {
		/**
		 * Defines the text of the <code>ui5-token</code>.
		 * <br><b>Note:</b> Аlthough this slot accepts HTML Elements, it is strongly recommended that you only use text in order to preserve the intended design.
		 *
		 * @type {Node[]}
		 * @slot
		 * @public
		 */
		text: {
			type: Node,
			multiple: true,
		},
	},
	properties: /** @lends sap.ui.webcomponents.main.Token.prototype */ {

		/**
		 * Defines whether the <code>ui5-token</code> is selected or not.
		 *
		 * @type {boolean}
		 * @public
		 */
		selected: { type: Boolean },

		/**
		 * Defines whether the <code>ui5-token</code> is read-only.
		 * <br><br>
		 * <b>Note:</b> A read-only <code>ui5-token</code> can not be deleted or selected,
		 * but still provides visual feedback upon user interaction.
		 *
		 * @type {boolean}
		 * @public
		 */
		readonly: { type: Boolean },

		_tabIndex: { type: String, defaultValue: "-1" },
	},

	events: /** @lends sap.ui.webcomponents.main.Token.prototype */ {

		/**
		 * Fired when the backspace, delete or close icon of the token is pressed
		 *
		 * @event
		 * @param {boolean} backSpace indicates whether token is deleted by backspace key
		 * @param {boolean} delete indicates whether token is deleted by delete key
		 * @public
		 */
		"delete": {
			detail: {
				"backSpace": { type: Boolean },
				"delete": { type: Boolean },
			},
		},

		/**
		 * Fired when the a token is selected by user interaction with mouse, clicking space or enter
		 *
		 * @event
		 * @public
		 */
		select: {},
	},
};

/**
 * @class
 *
 * <h3 class="comment-api-title">Overview</h3>
 *
 * Tokens are small items of information (similar to tags) that mainly serve to visualize previously selected items.
 *
 * @constructor
 * @author SAP SE
 * @alias sap.ui.webcomponents.main.Token
 * @extends UI5Element
 * @tagname ui5-token
 * @usestextcontent
 * @private
 */
class Token extends UI5Element {
	static get metadata() {
		return metadata;
	}

	static get render() {
		return litRender;
	}

	static get template() {
		return TokenTemplate;
	}

	static get styles() {
		return styles;
	}

	_select() {
		this.fireEvent("select");
	 }

	 _delete() {
		this.fireEvent("delete");
	 }

	 _keydown(event) {
		const isBS = isBackSpace(event);
		const isD = isDelete(event);

		if (!this.readonly && (isBS || isD)) {
			event.preventDefault();

			this.fireEvent("delete", {
				backSpace: isBS,
				"delete": isD,
			});
		}

		if (isEnter(event) || isSpace(event)) {
			this.fireEvent("select", {});
		}
	}

	get iconURI() {
		return getTheme() === "sap_fiori_3" ? "sap-icon://decline" : "sap-icon://sys-cancel";
	}

	static async define(...params) {
		await Icon.define();

		super.define(...params);
	}
}

Bootstrap.boot().then(_ => {
	Token.define();
});

export default Token;