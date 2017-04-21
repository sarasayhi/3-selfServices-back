-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.6.26 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出 graduation2017 的数据库结构
CREATE DATABASE IF NOT EXISTS `graduation2017`
/*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;
USE `graduation2017`;

-- 导出  表 graduation2017.goods 结构
CREATE TABLE IF NOT EXISTS `goods` (
  `goods_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品id',
  `name` varchar(120) COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '商品名称',
  `price` double NOT NULL DEFAULT '0' COMMENT '商品价格',
  `stock` int(11) NOT NULL DEFAULT '0' COMMENT '库存数量',
  `url` varchar(120) COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '图片路径',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '类型',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '上下架 上架：1 下架：0',
  PRIMARY KEY (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。


-- 导出  表 graduation2017.order 结构
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单id',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `total_amount` int(11) NOT NULL DEFAULT '0' COMMENT '商品数量',
  `total_price` double NOT NULL DEFAULT '0' COMMENT '订单总价',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。


-- 导出  表 graduation2017.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `name` varchar(120) COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '用户登录名',
  `password` varchar(120) COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '密码',
  `salt` varchar(120) COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '盐值',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。


-- 导出  表 graduation2017.wallet 结构
CREATE TABLE IF NOT EXISTS `wallet` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `money` double NOT NULL DEFAULT '0' COMMENT '余额',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
