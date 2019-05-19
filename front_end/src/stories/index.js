import { busDialog } from 'components/shared/DialogView.vue';
import dialogues from 'models/dialogues.js';
export default function start() {
  console.log(busDialog);
  busDialog.$emit('open', dialogues['intro']);
}
