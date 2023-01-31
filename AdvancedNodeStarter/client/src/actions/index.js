import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, history) => async (dispatch) => {
  // api 통신을 통해 업로드 이미지 Presigned Url 가져오기
  const uploadConfig = await axios.get('/api/upload');

  // Presigned Url 활용하여 브라우저에서 이미지 업로드
  const upload = await axios.put(uploadConfig.data.url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  // api 통신을 통해 블로그 포스트 데이터 생성
  const res = await axios.post('/api/blogs', values);

  // 유저를 특정 /blogs 페이지로 리다이렉트
  history.push('/blogs');

  // 새롭게 생성된 데이터를 브라우저 화면에 rendering하기 위해 Redux side에 블로그 포스트 데이터가 생성됐음을 알림
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async (dispatch) => {
  const res = await axios.get('/api/blogs');

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = (id) => async (dispatch) => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
