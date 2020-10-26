import www from '../Utils/www';
import config from '../Config/Config';

class MailService {

    async registerMail(newMail) {
        const url = config.serverAdmin + "admin/v1/mail";
        delete newMail.rawUids;

        if (newMail.rewardType === 'NONE') {
            delete newMail.rewardType
            delete newMail.rewardId;
            delete newMail.rewardAmount;
            delete newMail.rewardDetail;
        }
        
        return await www.postWithAlert(url, newMail, true);
    }

}

export default new MailService();