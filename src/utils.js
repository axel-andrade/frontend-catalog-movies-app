import { notification, message } from 'antd';

export default {
    openNotificationWithIcon: (type, message, description) => {
        notification[type]({ message, description });
    },
    checkURLImageIsValid: (url) => {
        if (!url)
            return false;
        return url.match(/\.(jpeg|jpg|gif|png)$/);
    }
}