package com.MarissaMan.entity;

import java.io.Serializable;
import java.util.Date;

public class Order implements Serializable {
    /**
     * ����id
     */
    private Integer orderId;

    /**
     * ����ʱ��
     */
    private Date createdTime;

    /**
     * ��Ʒ����
     */
    private Integer totalAmount;

    /**
     * �����ܼ�
     */
    private Double totalPrice;

    /**
     * �û�id
     */
    private Integer userId;

    private static final long serialVersionUID = 1L;

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", orderId=").append(orderId);
        sb.append(", createdTime=").append(createdTime);
        sb.append(", totalAmount=").append(totalAmount);
        sb.append(", totalPrice=").append(totalPrice);
        sb.append(", userId=").append(userId);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}