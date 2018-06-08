import {
    Howl,
    Howler
} from 'howler';
import '../scss/style.scss';
import se from '../sound/wall_se_1.mp3';
import Bluetooth from './modules/Bluetooth';


const sound = new Howl({
    src: [se]
});

const searchButton = document.querySelector('#search-button .btn');

console.log(searchButton)
const bluetooth = new Bluetooth({
    search: searchButton
})

bluetooth.on('near', () => {
    sound.play();
})


