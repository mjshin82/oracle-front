import Alert from "react-s-alert";

class AlertBox {
  defaultAlertOption = (timeout) => {
    return {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: timeout * 1000
    };
  };

  error = (message, timeout = 3) => {
    Alert.error(message, this.defaultAlertOption(timeout));
  }

  success = (message, timeout = 3) => {
    Alert.success(message, this.defaultAlertOption(timeout));
  };

  info = (message, timeout = 3) => {
    Alert.info(message, this.defaultAlertOption(timeout));
  };
}

export default new AlertBox();
