const { Plugin } = require('powercord/entities');
const { get, post } = require('powercord/http');
const { clipboard } = require('electron');

module.exports = class Mystbin extends Plugin {
    const domain = 'https://mystb.in'

   	async startPlugin() {
   		powercord.api.commands.registerCommand({
   			command: "mystbin",
   			description: "mystbin",
   			usage: "{c} [--send] [TEXT | --clipboard]",
   			executor: this.mystbin.bind(this)
   		});
   	}

   	pluginWillUnload() {
   		powercord.api.commands.unregisterCommand("mystbin");
   	}

   	async parseArgs(args) {
		const sendIndex = args.indexOf("--send");
		const send = sendIndex === -1 ? false : !!args.splice(sendIndex, 1);

		let input = args.join(" ");
		if (input === "--clipboard") {
			input = clipboard.readText();
		}
	    return {
        	send,
        	input
        };
   	}

   	async mystbin(args) {
   	    const { send, input } = await this.parseArgs(args);

		if (!input)
			return {
				send: false,
				result: `Invalid arguments. Run \`${powercord.api.commands.prefix}help mystbin\` for more information.`
			};

        try {
          const { body } = await post(`${domain}/documents`)
            .send(input)
          return {
            send,
            result: `${domain}/${body.key}`
          };
        } catch (e) {
          return {
            send: false,
            result: `Upload to mystbin failed.`
          };
        }
    }

}