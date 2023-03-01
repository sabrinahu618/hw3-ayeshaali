import { createApp } from "https://mavue.mavo.io/mavue.js";
import MaData from "https://mavue.mavo.io/ma-data/ma-data.js";

globalThis.app = createApp({
	data: {
		expenses: [],
		addItem: {
			title: "",
			date: "",
			lines: [{
				amount: "",
				payee: "",
				payer: "",
				currency: "USD"
			}]
		}
	},

	methods: {
		/**
		 * Currency convert function stub.
		 * In a real app, you would use an API to get the latest exchange rates,
		 * and we'd need to support all currency codes, not just EUR, USD and GBP.
		 * However, for the purposes of this assignment, this is fine.
		 * @param {"EUR" | "USD" | "GBP"} from - Currency code to convert from
		 * @param {"EUR" | "USD" | "GBP"} to - Currency code to convert to
		 * @param {number} amount - Amount to convert
		 * @returns {number} Converted amount
		 */
		currencyConvert(from, to, amount) {
			const rates = {
				USD: 1,
				EUR: 0.99,
				GBP: 0.85
			};

			return amount * rates[to] / rates[from];
		},

		addExpense() {
			this.expenses.push(this.addItem);
			this.addItem = {
				title: "",
				date: "",
				lines: [{
					amount: "",
					payee: "",
					payer: "",
					currence: "USD"
				}]
			}
		},

		addLine() {
			this.addItem.lines.push({
				amount: "",
				payee: "",
				payer: ""
			});
		},

		deleteLine(i) {
			this.addItem.lines.splice(i, 1);
		},


		deleteItem(i) {
			this.expenses.splice(i, 1);
		},

		async login (o) {
			this.inProgress = "Logging in...";
			await this.backend.login(o);

			if (this.dataLoaded === false) {
				await this.load();
			}

			this.inProgress = "";
			return this.backend.user;
		},
	},

	computed: {
		sortedExpenses() {
			return this.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
		},

		balances () {
			let balance = {
				trin: {
					trin: 0,
					neo: 0,
					joint: 0
				},
				neo: {
					trin: 0,
					neo: 0,
					joint: 0
				},
				joint: {
					trin: 0,
					neo: 0,
					joint: 0
				},
			}
			for (let expense of this.expenses) {
				for (let line of expense.lines) {
					balance[line.payer][line.payee] += this.currencyConvert(line.currency, "USD", line.amount)
				}
			}
			let total = 0;
			const trinity_paid = balance.trin.joint + balance.joint.neo;
			const neo_paid = balance.neo.joint + balance.joint.trin;
			const trinity_paid_for_neo = balance.trin.neo;
			const neo_paid_for_trinity = balance.neo.trin;

			total += (trinity_paid - neo_paid)/2 + trinity_paid_for_neo - neo_paid_for_trinity;
			balance.total = total;

			return balance;
		},
	},

	components: {
		"ma-data": MaData
	}
}, "#app");