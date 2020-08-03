const CN = 'zh-CN';

class Manager {
    constructor() {
        this.localizations = {
            [CN]: {}
        };
    }

    setLocalization(
        key, value, lang = CN
    ) {
        if(this.localizations[lang][key] && this.localizations[lang][key] !== value)
            return {
                ok: false,
                message: `检测到两处代码使用相同id: ${key} 但值不同。`
            };
        this.localizations[lang][key] = value;
        return {
            ok: true,
        };
    }

    getLocalization(lang = CN) {
        return this.localizations[lang];
    }
}

module.exports = Manager;
