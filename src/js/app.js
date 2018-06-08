import {
    Howl,
    Howler
} from 'howler';
import '../scss/style.scss';
import font from '../font/JF-Dot-MPlusS10.ttf';
import '../image/connect.svg';
import '../image/text1.svg';
import '../image/tweet.svg';
import '../image/work.svg';
import se from '../sound/wall_se_1.mp3';
import Bluetooth from './modules/Bluetooth';
import share from './modules/shareHelper';


const sound = new Howl({
    src: [se]
});

const database = firebase.database();

const connectButton = document.querySelector('.js-connect');
const workButton = document.querySelector('.js-work');
const tweetButton = document.querySelector('.js-tweet');
let counter = 0;

const bluetooth = new Bluetooth({
    search:connectButton 
})

bluetooth.on('near', () => {
    sound.play();
    addCounter();
})

workButton.addEventListener('click', () => {
    sound.play();
    addCounter();
})

tweetButton.addEventListener('click', () => {
    window.open(
        share.twitter({
            text: `あなたは${counter}回壁にぶち当たりました。`,
            url: '',
            hashtags: 'IoT壁'
        })
    )   
})

function addCounter() {
    database.ref('iot_wall').transaction('value', (post) => {
        post.counter++;
        return post
    })
}

database.ref('iot_wall').on('value', (snapchat) => {
    counter = snapchat.val().counter;
})