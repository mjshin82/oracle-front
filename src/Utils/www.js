import axios from 'axios/index';
import util from "./util";
import {SimpleLoader} from "../Containers";

class WWW {
    constructor() {
        this.authId = "";
        this.authToken = "";
    }

    async post(path, data, loading) {
        await util.sleep(1);
        if (loading) {
            SimpleLoader.show();
        }

        let headers = {
            "Content-type": "application/json",
            "authId": this.authId,
            "authToken": this.authToken
        };

        try {
            let res = await axios.post(path, data, {
                headers: headers
            });

            if (this.isFailed(res.status)) {
                let message = "Can not load data.";
                let error = res.data;
                if (error != null) {
                    message = error.message;
                }
                console.error(message);
            }

            return res.data;
        } catch (e) {
            console.error(e);
        } finally {
            if (loading) {
                SimpleLoader.hide();
            }
        }
    }


    async postWithAlert(path, data, loading) {
        await util.sleep(1);
        if (loading) {
            SimpleLoader.show();
        }

        let headers = {
            "Content-type": "application/json",
            "authId": this.authId,
            "authToken": this.authToken
        };

        try {
            let res = await axios.post(path, data, {
                headers: headers
            });

            return res.data;
        } catch (e) {
            alert(e.response.data.message)
        } finally {
            if (loading) {
                SimpleLoader.hide();
            }
        }
    }

    async get(path, loading, headers) {
        await util.sleep(1);
        if (loading) {
            SimpleLoader.show();
        }

        if (headers == null) {
            headers = {
                "Content-type": "application/json",
                "authId": this.authId,
                "authToken": this.authToken
            };
        }

        try {
            let res = await axios.get(path, {
                headers: headers
            });
            return res.data;
        } catch (e) {
            console.error(e);
        } finally {
            if (loading) {
                SimpleLoader.hide();
            }
        }
    }

    async getWithAlert(path, loading, headers) {
        await util.sleep(1);
        if (loading) {
            SimpleLoader.show();
        }

        if (headers == null) {
            headers = {
                "Content-type": "application/json",
                "authId": this.authId,
                "authToken": this.authToken
            };
        }

        try {
            let res = await axios.get(path, {
                headers: headers
            });

            if (this.isFailed(res.status)) {
                let message = "Can not load data.";
                let error = res.data;
                if (error != null) {
                    message = error.message;
                }
                console.error(message);
            }

            return res.data;
        } catch (e) {
            alert(e.response.data.message);
        } finally {
            if (loading) {
                SimpleLoader.hide();
            }
        }
    }

    async del(path, loading, headers) {
        await util.sleep(1);
        if (loading) {
            SimpleLoader.show();
        }

        if (headers == null) {
            headers = {
                "Content-type": "application/json",
                "authId": this.authId,
                "authToken": this.authToken
            };
        }

        try {
            let res = await axios.delete(path, {
                headers: headers
            });

            if (this.isFailed(res.status)) {
                let message = "Can not load data.";
                let error = res.data;
                if (error != null) {
                    message = error.message;
                }
                console.error(message);
            }

            return res.data;
        } catch (e) {
            console.error(e);
        } finally {
            if (loading) {
                SimpleLoader.hide();
            }
        }
    }

    async delWithAlert(path, loading, headers) {
        await util.sleep(1);
        if (loading) {
            SimpleLoader.show();
        }

        if (headers == null) {
            headers = {
                "Content-type": "application/json",
                "authId": this.authId,
                "authToken": this.authToken
            };
        }

        try {
            let res = await axios.delete(path, {
                headers: headers
            });

            return res.data;
        } catch (e) {
            alert(e.response.data.message);
        } finally {
            if (loading) {
                SimpleLoader.hide();
            }
        }
    }

    isSuccess = (resCode) => {
        return resCode / 100 === 2 || resCode === 304;
    };

    isFailed = (resCode) => {
        return !this.isSuccess(resCode);
    };
}

export default new WWW();
