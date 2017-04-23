package com.MarissaMan.entity;

import java.io.Serializable;

public class Sort implements Serializable {
    /**
     * 类别id
     */
    private Integer sortId;

    /**
     * 类别名称
     */
    private String sortName;

    private static final long serialVersionUID = 1L;

    public Integer getSortId() {
        return sortId;
    }

    public void setSortId(Integer sortId) {
        this.sortId = sortId;
    }

    public String getSortName() {
        return sortName;
    }

    public void setSortName(String sortName) {
        this.sortName = sortName == null ? null : sortName.trim();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", sortId=").append(sortId);
        sb.append(", sortName=").append(sortName);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}