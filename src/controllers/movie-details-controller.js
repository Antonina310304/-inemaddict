import {render, KEY_CODE, unrender, USER_RATING_COUNT, DATA_CHANGE, DATA_CHANGE_USER_DETAILS, DATA_CHANGE_TYPE, DATA_CHANGE_COMMENTS, RATING} from '../utils.js';
import moment from 'moment';
import MovieDetails from '../components/movie-detail/movie-details.js';
import BtnControls from '../components/movie-detail/btn-controls.js';
import CommentsController from './comments-controller.js';
import UserRating from '../components/movie-detail/user-rating/user-rating.js';

export default class MovieDetailsController{
  constructor(movieData, commentsData, onClosePopup, onDataChange) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._onClosePopup = onClosePopup;
    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._movie = new MovieDetails(this._movieData);
    this.onDataChange = onDataChange.bind(this);
    this._comments = new CommentsController(this._commentsData, this.onDataChange);
    this._closeBtn = this._movie.getElement().querySelector(`.film-details__close-btn`);
    this._containerRating = this._movie.getElement().querySelector(`.form-details__middle-container`);
    this._btnControls = null;
    this._userRating = null;
    this._btnControls = null;
  }

  init(container) {
    this._container = container;
    render(this._container, this._movie.getElement());

    this._renderBtnControls();
    this._toggleUserRating();
    this._renderComments();
    this._initListeners();
  }

  _renderUserRating() {
    this._userRating = new UserRating(this._movieData.user_details.personal_rating, this.onDataChange);
    this._userRating.init(this._containerRating);
  }

  _unrenderUserRating() {
    this._remove(this._userRating);
    this._userRating = null;
  }

  _toggleUserRating() {
    const alreadyWatched = this._movieData.user_details.already_watched;

    if(alreadyWatched && !this._userRating) {
      this._renderUserRating();
    } else if(!alreadyWatched && this._userRating) {
      this._unrenderUserRating();
    }
  }

  _initListeners() {
    this._closeBtn.addEventListener(`click`, this._onCloseBtnClick);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if(evt.key === KEY_CODE.ESC) {
      this._onCloseBtnClick();
    }
  }

  _onCloseBtnClick() {
    this._onClosePopup();
    this._closeBtn.removeEventListener(`click`, this._onClose);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _renderBtnControls() {
    this._btnControls = new BtnControls(this._movieData.user_details, this.onDataChange);
    const container = this._movie.getElement().querySelector(`.form-details__top-container`);
    this._btnControls.init(container);
  }

  _updateData(typeData, data) {
    if(typeData === DATA_CHANGE_COMMENTS) {
      this._movieData.comments = data.DATA_CHANGE_USER_DETAILS;
      this._commentsData = data.DATA_CHANGE_COMMENTS;
    } else if (typeData === DATA_CHANGE_USER_DETAILS) {
      this._movieData.user_details = data;
    }
  }

  update(typeData, data) {
    this._updateData(typeData, data);

    switch (typeData) {
      case DATA_CHANGE_USER_DETAILS:
        this._btnControls.update(this._movieData.user_details.watchlist, this._movieData.user_details.already_watched, this._movieData.user_details.favorite)
        this._toggleUserRating();
        break;
      case DATA_CHANGE_COMMENTS:
        this._comments.update(this._commentsData);
        break;
      case RATING:
        if(this._userRating) {
          this._userRating.update(this._movieData.user_details.personal_rating);
        }
        break;
    }
  }

  _renderComments() {
    const container = this._movie.getElement().querySelector(`.form-details__bottom-container`);
    this._comments.init(container);
  }

  _remove(elem) {
    unrender(elem.getElement());
    elem.removeElement();
  }

  unrender() {
    this._comments.unrender();
    this._remove(this._movie);
    this._remove(this._btnControls);

    if(this._userRating) {
      this._unrenderUserRating();
    }
  }
}
