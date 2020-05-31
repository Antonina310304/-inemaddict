import HomePageController from "./home-page-controller.js";
import Search from "../components/search.js";
import Profile from "../components/profile.js";
import { render, DATA_CHANGE, DATA_CHANGE_TYPE, DATA_CHANGE_USER_DETAILS, CREATE_COMMENT, REMOVE_COMMENT, RATING } from "../utils.js";
import MainNavController from "./main-nav-controller.js";
import StatsController from "./stats.js";
import {cloneDeep} from 'lodash';

export default class MainPageController {
  constructor(container, onDataChange) {
    this._container= container;
    this._profile = new Profile();
    this._onDataChangeMain = onDataChange;
    this._mainContainer = this._container.querySelector('.main');
    this._onMainBtnClick = this._onMainBtnClick.bind(this);
    this._mainNavController = new MainNavController(this._mainContainer, this._onMainBtnClick);
    this._homePage = new HomePageController(this._mainContainer, this.onDataChange.bind(this));
    this._activeWindow = null;
    this._filterBoard = null;
    this.initSearch = this.initSearch.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this._MIN_LENGTH_VALUE = 3;
    this._search = new Search(this.initSearch, this.resetSearch, this._MIN_LENGTH_VALUE);
    this._stats = new StatsController(this._mainContainer);
    this._dataChangeType = null;
    this._tmpData = null;
  }

  init(movieData, api) {
    this._movieData = movieData;
    this._api = api;
    const header = this._container.querySelector('.header');
    this._renderSearchForm(header);
    this._renderProfile(header);
    this._mainNavController.init(this._movieData);
    this._homePage.init(this._movieData, this._api);
    this._activeWindow = this._homePage;
    this.onDataChange = this.onDataChange.bind(this);
  }


  _initTmpData(data) {
    this._tmpData = cloneDeep(data);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  initSearch(searchData) {
    this._homePage.initSearch(searchData);
    this._mainNavController.hide();
  }

  resetSearch() {
    this._homePage.home();
    this._mainNavController.show();
  }

  onDataChange(typeData, movieId, data) {
  // onDataChange({typeDataChange, movieId, userDetails, commentsData}) {
    this._dataChangeType = DATA_CHANGE_TYPE[typeData];
    let idDataChange = movieId;
    this._movieIndex = this._movieData.findIndex((i) => i.id === idDataChange);
    this._initTmpData(this._movieData[this._movieIndex])
    switch (typeData) {
      case DATA_CHANGE.WATCHLIST:
        this._tmpData.user_details.watchlist = data;
        break;
        case DATA_CHANGE.FAVORITE:
          this._tmpData.user_details.favorite = data;
        break;
      case DATA_CHANGE.ALREADY_WATCHED:
        this._tmpData.user_details.already_watched = data;
        if(!this._tmpData.user_details.already_watched) {
          this._tmpData.user_details.personal_rating = 0;
        }
        break;
      case DATA_CHANGE.RATING:
        this._tmpData.user_details.personal_rating = data;
        // this._tmpData.user_details.watching_date = new Date();
        break;
      case DATA_CHANGE.CREATE_COMMENT:
        this._tmpData = data;
        break;
      case DATA_CHANGE.REMOVE_COMMENT:
        idDataChange = data;
        break;
    }
    this._onDataChangeMain(this._dataChangeType, idDataChange, this._tmpData);
    this._resetTmpData();
  }

  update({movie, comments}) {
    let newMovieData;
    const movieId = this._movieData[this._movieIndex].id;
    console.log(movie)
    this._movieData[this._movieIndex] = movie;
    switch (this._dataChangeType) {
      case REMOVE_COMMENT:
        newMovieData = this._movieData[this._movieIndex][`comments`];
        break;
      case (DATA_CHANGE_USER_DETAILS):
        newMovieData = this._movieData[this._movieIndex].user_details
        break;
      case (RATING):
        newMovieData = this._movieData[this._movieIndex].user_details
        break;
      case CREATE_COMMENT:
        newMovieData = {}
        newMovieData[`movie`] = this._movieData[this._movieIndex][`comments`];
        newMovieData[`comments`] = comments;
        break;
    }
    this._activeWindow.update(this._dataChangeType, movieId, newMovieData, comments);
    this._mainNavController.init(this._movieData);
  }

  _onMainBtnClick(filterType) {
    if(filterType === `stats`) {
      this._stats.show(this._movieData);
      this._homePage.hide();
      this._activeWindow = this._stats;
    } else {
      switch(this._activeWindow) {
        case this._stats:
          this._stats.hide();
          this._homePage.home()
          this._activeWindow = this._homePage;
          break;
        default:
          this._homePage.renderFilter(filterType);
          break;
      }
    }
  };

  _renderSearchForm(container) {
    render(container, this._search.getElement())
  }

  _renderProfile(container) {
    render(container, this._profile.getElement())
  }
}
