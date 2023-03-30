export default class UrlUtils {
	static regex = new RegExp("^(http(s):\\/\\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$")

	static validURL = (url = "") => {
		return this.regex.test(url)
	};

	static locationType(url = "") {
		if (!this.validURL(url)) return "unknown";
		const target = new URL(url);
		if (/^(www|comp\.)?krunker\.io$/.test(target.hostname)) {
			if (/^\/docs\/.+\.txt$/.test(target.pathname)) return "docs";
			switch (target.pathname) {
				case "/": return "game";
				case "/social.html": return "social";
				case "/viewer.html": return "viewer";
				case "/editor.html": return "editor";
				default: return "unknown";
			}
		}
		return "external";
	}
}
