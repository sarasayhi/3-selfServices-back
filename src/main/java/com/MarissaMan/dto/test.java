package com.MarissaMan.dto;

/**
 * Created by saras on 2017/4/19.
 */
public class test<T> {

        private boolean success;

        private T data;

        private String error;

        public test(boolean success, T data) {
            this.success = success;
            this.data = data;
        }

        public test(boolean success, String error) {
            this.success = success;
            this.error = error;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public T getData() {
            return data;
        }

        public void setData(T data) {
            this.data = data;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
}
