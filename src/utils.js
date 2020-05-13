import { notification, message } from 'antd';

export default {
    openNotificationWithIcon: (type, message, description) => {
        notification[type]({ message, description });
    },
    checkURLImageIsValid: (url) => {
        if (!url)
            return false;
        return url.match(/\.(jpeg|jpg|gif|png)$/);
    },
    formatDate: (data) => {

        const dia = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(),
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear();
        return diaF + "/" + mesF + "/" + anoF;
    },
}