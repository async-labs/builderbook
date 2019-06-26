import { openSnackbar } from '../components/Notifier';

export default function notify(obj) {
  openSnackbar({ message: obj.message || obj.toString() });
}
