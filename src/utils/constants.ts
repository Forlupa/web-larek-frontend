import { CategoryList } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export const categoryList: CategoryList = {
  другое: 'card__category_other',
  софт: 'card__category_soft',
  дополнительное: 'card__category_additional',
  кнопка: 'card__category_button',
  хард: 'card__category_hard',
};