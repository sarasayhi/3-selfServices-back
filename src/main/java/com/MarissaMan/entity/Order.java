package com.MarissaMan.entity;

import java.io.Serializable;
import java.util.Date;

public class Order implements Serializable {
    /**
     * ����id
     */
    private Integer orderId;

    /**
     * �û�id
     */
    private Integer userId;

    /**
     * �����ܼ�
     */
    private Double totalPrice;

    /**
     * ��Ʒ����
     */
    private Integer totalAmount;

    /**
     * ����ʱ��
     */
    private Date createdTime;

    /**
     * ����״̬
     */
    private Integer status;

    /**
     * ������֤��
     */
    private Integer identifyCode;

    private static final long serialVersionUID = 1L;

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getIdentifyCode() {
        return identifyCode;
    }

    public void setIdentifyCode(Integer identifyCode) {
        this.identifyCode = identifyCode;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", orderId=").append(orderId);
        sb.append(", userId=").append(userId);
        sb.append(", totalPrice=").append(totalPrice);
        sb.append(", totalAmount=").append(totalAmount);
        sb.append(", createdTime=").append(createdTime);
        sb.append(", status=").append(status);
        sb.append(", identifyCode=").append(identifyCode);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}