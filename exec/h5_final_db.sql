-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: h5
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_log`
--

DROP TABLE IF EXISTS `ai_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_log` (
  `game_log_id` int NOT NULL,
  `f_happy` int NOT NULL,
  `f_anger` int NOT NULL,
  `f_sad` int NOT NULL,
  `f_panic` int NOT NULL,
  `f_fear` int NOT NULL,
  `t_happy` int NOT NULL,
  `t_anger` int NOT NULL,
  `t_sad` int NOT NULL,
  `t_panic` int NOT NULL,
  `t_fear` int NOT NULL,
  `stt` text NOT NULL,
  `ai_analyze` text NOT NULL,
  PRIMARY KEY (`game_log_id`),
  CONSTRAINT `FK_game_log_TO_ai_log_1` FOREIGN KEY (`game_log_id`) REFERENCES `game_log` (`game_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_log`
--

LOCK TABLES `ai_log` WRITE;
/*!40000 ALTER TABLE `ai_log` DISABLE KEYS */;
INSERT INTO `ai_log` VALUES (1,2,2,2,2,2,2,2,2,2,2,'test1123','test0'),(4,0,0,0,0,0,0,0,0,0,0,'test','test'),(5,0,0,0,0,0,0,0,0,0,0,'test','test'),(6,0,0,0,0,0,0,0,0,0,0,'test','test'),(7,0,0,0,0,0,0,0,0,0,0,'test','test'),(8,0,0,0,0,0,0,0,0,0,0,'test','test'),(9,0,0,0,0,0,0,0,0,0,0,'test','test'),(10,0,0,0,0,0,0,0,0,0,0,'최고의 선물이에요 감사해요!','test'),(11,0,0,0,0,0,0,0,0,0,0,'최고의 선물이에요 감사해요!','test'),(12,0,0,0,0,0,0,0,0,0,0,'최고의 선물이에요 감사해요!','test'),(13,0,0,0,0,0,0,0,0,0,0,'최고의 선물이에요 감사해요!','test'),(14,0,0,0,0,0,0,0,0,0,0,'최고의 선물이에요 감사해요!','test'),(15,0,0,0,0,0,0,0,0,0,0,'너무 신나요!','test'),(16,0,0,0,0,0,0,0,0,0,0,'속상해요...','test'),(17,0,0,0,0,0,0,0,0,0,0,'기다리기 싫어요.','test'),(18,0,0,0,0,0,0,0,0,0,0,'무서워요!','test'),(19,0,0,0,0,0,0,0,0,0,0,'무서워요!','test'),(20,0,0,0,0,0,0,0,0,0,0,'대단해요!','test');
/*!40000 ALTER TABLE `ai_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_asset`
--

DROP TABLE IF EXISTS `card_asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_asset` (
  `game_stage_id` int NOT NULL COMMENT 'game_stage와 1:1',
  `card_front` varchar(255) NOT NULL,
  `card_back` varchar(255) NOT NULL,
  PRIMARY KEY (`game_stage_id`),
  CONSTRAINT `FK_game_stage_TO_card_asset_1` FOREIGN KEY (`game_stage_id`) REFERENCES `game_stage` (`game_stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_asset`
--

LOCK TABLES `card_asset` WRITE;
/*!40000 ALTER TABLE `card_asset` DISABLE KEYS */;
INSERT INTO `card_asset` VALUES (1,'https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_1/1-1-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_1/1-1-b.png'),(2,'https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_2/1-2-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_2/1-2-b.png'),(3,'https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_3/1-3-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_3/1-3-b.png'),(4,'https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_4/1-4-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_4/1-4-b.png'),(5,'https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_5/1-5-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_1/stage_5/1-5-b.png'),(6,'https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_1/2-1-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_1/2-1-b.png'),(7,'https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_2/2-2-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_2/2-2-b.png'),(8,'https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_3/2-3-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_3/2-3-b.png'),(9,'https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_4/2-4-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_4/2-4-b.png'),(10,'https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_5/2-5-f.png','https://cdn.hi-five.site/assets/card_assets/chapter_2/stage_5/2-5-b.png');
/*!40000 ALTER TABLE `card_asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `center`
--

DROP TABLE IF EXISTS `center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `center` (
  `center_id` int NOT NULL AUTO_INCREMENT,
  `center_name` varchar(50) NOT NULL,
  `center_contact` varchar(30) NOT NULL,
  PRIMARY KEY (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `center`
--

LOCK TABLES `center` WRITE;
/*!40000 ALTER TABLE `center` DISABLE KEYS */;
INSERT INTO `center` VALUES (1,'C205','050505');
/*!40000 ALTER TABLE `center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_game_chapter`
--

DROP TABLE IF EXISTS `child_game_chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_game_chapter` (
  `child_game_chapter_id` int NOT NULL AUTO_INCREMENT,
  `child_user_id` int NOT NULL,
  `game_chapter_id` int NOT NULL,
  `start_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_dttm` datetime DEFAULT NULL,
  PRIMARY KEY (`child_game_chapter_id`),
  KEY `FK_child_user_TO_child_game_chapter_1` (`child_user_id`),
  KEY `FK_game_chapter_TO_child_game_chapter_1` (`game_chapter_id`),
  CONSTRAINT `FK_child_user_TO_child_game_chapter_1` FOREIGN KEY (`child_user_id`) REFERENCES `child_user` (`child_user_id`),
  CONSTRAINT `FK_game_chapter_TO_child_game_chapter_1` FOREIGN KEY (`game_chapter_id`) REFERENCES `game_chapter` (`game_chapter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_game_chapter`
--

LOCK TABLES `child_game_chapter` WRITE;
/*!40000 ALTER TABLE `child_game_chapter` DISABLE KEYS */;
INSERT INTO `child_game_chapter` VALUES (1,2,1,'2025-02-11 15:43:12','2025-02-11 15:49:00'),(2,2,1,'2025-02-11 15:43:48','2025-02-11 15:48:04'),(3,2,1,'2025-02-11 15:43:56','2025-02-11 15:48:06'),(4,2,1,'2025-02-11 15:44:03','2025-02-11 15:48:09'),(6,2,2,'2025-02-19 11:40:50',NULL),(7,2,2,'2025-02-19 11:43:02',NULL),(8,2,2,'2025-02-19 11:48:28',NULL),(9,2,2,'2025-02-19 11:51:58','2025-02-19 11:53:02'),(10,2,2,'2025-02-19 11:54:14','2025-02-19 11:55:13'),(11,2,2,'2025-02-19 11:56:51','2025-02-19 12:01:39'),(12,2,2,'2025-02-19 12:10:14',NULL),(13,2,2,'2025-02-19 12:12:30',NULL),(14,2,2,'2025-02-19 13:16:49',NULL),(15,2,2,'2025-02-19 13:19:32',NULL),(16,2,2,'2025-02-19 13:21:10',NULL),(17,2,2,'2025-02-19 13:25:09',NULL),(18,2,2,'2025-02-19 13:26:59',NULL),(19,2,2,'2025-02-19 13:54:24',NULL),(20,2,2,'2025-02-19 13:57:57',NULL),(21,2,2,'2025-02-19 14:15:17',NULL),(22,2,2,'2025-02-19 14:20:42',NULL),(23,2,2,'2025-02-19 14:22:28',NULL),(24,2,2,'2025-02-19 14:23:14',NULL),(25,2,2,'2025-02-19 14:26:11',NULL),(26,2,2,'2025-02-19 14:26:48',NULL),(27,2,2,'2025-02-19 14:27:41',NULL),(28,2,2,'2025-02-19 14:41:20',NULL),(29,2,2,'2025-02-19 14:42:27',NULL),(30,2,2,'2025-02-19 14:43:56',NULL),(31,2,2,'2025-02-19 14:47:00',NULL),(32,2,2,'2025-02-19 14:50:34',NULL),(33,2,2,'2025-02-19 14:52:56',NULL),(34,2,2,'2025-02-19 14:55:34',NULL),(35,2,2,'2025-02-19 14:58:06',NULL),(36,2,2,'2025-02-19 14:58:57',NULL),(37,2,2,'2025-02-19 15:01:42',NULL),(38,2,2,'2025-02-19 15:04:27',NULL),(39,2,2,'2025-02-19 15:07:33',NULL),(40,11,1,'2025-02-19 15:12:39',NULL),(41,2,2,'2025-02-19 15:13:04',NULL),(42,2,2,'2025-02-19 15:21:42',NULL),(43,2,2,'2025-02-19 15:22:41',NULL),(44,2,2,'2025-02-19 15:24:07',NULL),(45,2,2,'2025-02-19 15:26:08',NULL),(46,2,2,'2025-02-19 15:31:28',NULL),(47,2,2,'2025-02-19 15:31:59',NULL),(48,2,2,'2025-02-19 15:33:58',NULL),(49,2,2,'2025-02-19 15:34:48',NULL),(50,2,2,'2025-02-19 15:41:08',NULL),(51,2,2,'2025-02-19 15:42:11',NULL),(52,2,2,'2025-02-19 16:03:55',NULL),(53,2,2,'2025-02-19 16:09:18',NULL),(54,2,2,'2025-02-19 16:13:25',NULL),(55,2,2,'2025-02-19 16:18:29',NULL),(56,2,2,'2025-02-19 16:20:41',NULL),(57,2,2,'2025-02-19 16:21:23',NULL),(58,2,2,'2025-02-19 16:23:38',NULL),(59,2,2,'2025-02-19 16:25:53',NULL),(60,2,2,'2025-02-19 16:30:08',NULL),(61,2,2,'2025-02-19 16:32:21',NULL),(62,2,2,'2025-02-19 16:35:46',NULL),(63,2,2,'2025-02-19 16:38:39',NULL),(64,2,2,'2025-02-19 16:39:10',NULL),(65,2,2,'2025-02-19 16:41:09',NULL),(66,2,2,'2025-02-19 16:42:53',NULL),(67,2,2,'2025-02-19 16:44:42',NULL),(68,2,2,'2025-02-19 16:49:23',NULL),(69,2,2,'2025-02-19 16:53:11',NULL),(70,2,2,'2025-02-19 16:55:07',NULL),(71,2,2,'2025-02-19 17:05:25',NULL),(72,2,2,'2025-02-19 17:05:47',NULL),(73,2,2,'2025-02-19 17:10:31',NULL),(74,2,2,'2025-02-19 17:12:24',NULL),(75,2,2,'2025-02-19 17:18:24',NULL),(76,2,2,'2025-02-19 17:30:01',NULL),(77,2,2,'2025-02-19 17:33:28','2025-02-19 17:38:30'),(78,2,2,'2025-02-20 00:45:00',NULL),(79,2,2,'2025-02-20 00:46:39',NULL),(80,2,2,'2025-02-20 00:48:59',NULL),(81,2,2,'2025-02-20 00:50:36',NULL),(82,2,2,'2025-02-20 00:55:33',NULL),(83,10,1,'2025-02-20 03:08:46',NULL),(84,2,1,'2025-02-20 09:37:47',NULL),(85,10,1,'2025-02-20 12:01:12',NULL),(86,2,1,'2025-02-20 14:06:07',NULL),(87,11,1,'2025-02-20 15:06:06',NULL),(88,11,1,'2025-02-20 15:06:09',NULL),(89,9,1,'2025-02-20 17:17:37',NULL);
/*!40000 ALTER TABLE `child_game_chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_game_stage`
--

DROP TABLE IF EXISTS `child_game_stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_game_stage` (
  `child_game_stage_id` int NOT NULL AUTO_INCREMENT,
  `game_stage_id` int NOT NULL,
  `user_chapter_id` int NOT NULL,
  PRIMARY KEY (`child_game_stage_id`),
  KEY `FK_game_stage_TO_child_game_stage_1` (`game_stage_id`),
  KEY `FK_child_game_chapter_TO_child_game_stage_1` (`user_chapter_id`),
  CONSTRAINT `FK_child_game_chapter_TO_child_game_stage_1` FOREIGN KEY (`user_chapter_id`) REFERENCES `child_game_chapter` (`child_game_chapter_id`),
  CONSTRAINT `FK_game_stage_TO_child_game_stage_1` FOREIGN KEY (`game_stage_id`) REFERENCES `game_stage` (`game_stage_id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_game_stage`
--

LOCK TABLES `child_game_stage` WRITE;
/*!40000 ALTER TABLE `child_game_stage` DISABLE KEYS */;
INSERT INTO `child_game_stage` VALUES (1,1,2),(2,1,1),(3,1,3),(4,1,4),(5,2,6),(6,2,8),(7,2,9),(8,2,9),(9,2,10),(10,2,10),(11,2,10),(12,2,11),(13,2,11),(14,2,11),(15,2,11),(16,2,11),(17,2,12),(18,2,12),(19,2,13),(20,2,14),(21,2,15),(22,2,16),(23,2,16),(24,2,16),(25,2,17),(26,2,18),(27,2,19),(28,2,20),(29,2,20),(30,2,21),(31,2,22),(32,2,23),(33,2,24),(34,2,25),(35,2,26),(36,2,27),(37,2,28),(38,2,29),(39,2,30),(40,2,31),(41,2,33),(42,2,34),(43,2,35),(44,2,36),(45,2,37),(46,2,38),(47,2,39),(48,2,41),(49,2,42),(50,2,43),(51,2,44),(52,2,45),(53,2,45),(54,2,45),(55,2,45),(56,2,45),(57,2,46),(58,2,47),(59,2,49),(60,2,49),(61,2,49),(62,2,50),(63,2,51),(64,2,51),(65,2,51),(66,2,51),(67,2,51),(68,2,52),(69,2,53),(70,2,53),(71,2,53),(72,2,54),(73,2,54),(74,2,54),(75,2,55),(76,2,55),(77,2,56),(78,2,58),(79,2,59),(80,2,59),(81,2,59),(82,2,60),(83,2,60),(84,2,61),(85,2,62),(86,2,64),(87,2,64),(88,2,65),(89,2,65),(90,2,66),(91,2,67),(92,2,68),(93,2,69),(94,2,70),(95,2,72),(96,2,73),(97,2,74),(98,2,75),(99,2,76),(100,2,77),(101,2,77),(102,2,77),(103,2,78),(104,2,79),(105,2,80),(106,2,81),(107,2,82),(108,10,83),(109,2,84),(110,2,86),(111,9,89),(112,9,89),(113,9,89),(114,9,89),(115,9,89);
/*!40000 ALTER TABLE `child_game_stage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_study_chapter`
--

DROP TABLE IF EXISTS `child_study_chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_study_chapter` (
  `child_study_chapter_id` int NOT NULL AUTO_INCREMENT,
  `child_user_id` int NOT NULL,
  `game_chapter_id` int NOT NULL,
  `start_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_dttm` datetime DEFAULT NULL,
  PRIMARY KEY (`child_study_chapter_id`),
  KEY `FK_child_user_TO_child_study_chapter_1` (`child_user_id`),
  KEY `FK_game_chapter_TO_child_study_chapter_1_idx` (`game_chapter_id`),
  CONSTRAINT `FK_child_user_TO_child_study_chapter_1` FOREIGN KEY (`child_user_id`) REFERENCES `child_user` (`child_user_id`),
  CONSTRAINT `FK_game_chapter_TO_child_study_chapter_1` FOREIGN KEY (`game_chapter_id`) REFERENCES `game_chapter` (`game_chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_study_chapter`
--

LOCK TABLES `child_study_chapter` WRITE;
/*!40000 ALTER TABLE `child_study_chapter` DISABLE KEYS */;
/*!40000 ALTER TABLE `child_study_chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_study_stage`
--

DROP TABLE IF EXISTS `child_study_stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_study_stage` (
  `child_study_stage_id` int NOT NULL AUTO_INCREMENT,
  `game_stage_id` int NOT NULL,
  `child_study_chapter_id` int NOT NULL,
  `start_dttm` datetime NOT NULL,
  `end_dttm` datetime DEFAULT NULL,
  PRIMARY KEY (`child_study_stage_id`),
  KEY `FK_game_stage_TO_child_study_stage_1` (`game_stage_id`),
  KEY `FK_child_study_chapter_TO_child_study_stage_1` (`child_study_chapter_id`),
  CONSTRAINT `FK_child_study_chapter_TO_child_study_stage_1` FOREIGN KEY (`child_study_chapter_id`) REFERENCES `child_study_chapter` (`child_study_chapter_id`),
  CONSTRAINT `FK_game_stage_TO_child_study_stage_1` FOREIGN KEY (`game_stage_id`) REFERENCES `game_stage` (`game_stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_study_stage`
--

LOCK TABLES `child_study_stage` WRITE;
/*!40000 ALTER TABLE `child_study_stage` DISABLE KEYS */;
/*!40000 ALTER TABLE `child_study_stage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_user`
--

DROP TABLE IF EXISTS `child_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_user` (
  `child_user_id` int NOT NULL AUTO_INCREMENT,
  `interest` text NOT NULL,
  `first_consult_dt` date NOT NULL,
  `birth` date NOT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `additional_info` text,
  `clear_chapter` tinyint DEFAULT '1',
  `name` varchar(10) NOT NULL,
  `parent_user_id` int NOT NULL,
  `consultant_user_id` int NOT NULL,
  `delete_dttm` datetime DEFAULT NULL,
  PRIMARY KEY (`child_user_id`),
  KEY `FK_parent_user_TO_child_user_1` (`parent_user_id`),
  KEY `FK_consultant_user_TO_child_user_1` (`consultant_user_id`),
  CONSTRAINT `FK_consultant_user_TO_child_user_1` FOREIGN KEY (`consultant_user_id`) REFERENCES `consultant_user` (`consultant_user_id`),
  CONSTRAINT `FK_parent_user_TO_child_user_1` FOREIGN KEY (`parent_user_id`) REFERENCES `parent_user` (`parent_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_user`
--

LOCK TABLES `child_user` WRITE;
/*!40000 ALTER TABLE `child_user` DISABLE KEYS */;
INSERT INTO `child_user` VALUES (2,'없어용','2025-01-25','2025-01-25','M','없어',1,'한승우',4,0,NULL),(4,'몰?루','2025-02-01','2025-02-01','F','몰?루',1,'정수연',6,0,NULL),(5,'몰?루','2025-01-01','1996-09-19','M','몰?루',1,'김지우',7,0,NULL),(9,'바나나','2025-01-01','2025-01-01','M','바나나',1,'한지민',4,0,NULL),(10,'바나나','2020-02-17','2015-02-01','F','2시22분',1,'정수연',10,3,NULL),(11,'고기 먹고 싶당','2022-02-18','2019-04-23','M','additional_info',1,'김아동',1,4,NULL),(12,'야구','2023-05-09','2021-08-20','M','신체능력이 뛰어납니다.',1,'이정후',11,0,NULL),(13,'야구','2023-05-09','2021-08-20','M','신체능력이 뛰어납니다.',1,'이정후',12,0,'2025-02-19 10:26:03'),(14,'바나나를 좋아합니다.','2025-02-13','2006-06-20','M','키가 큼니다.',NULL,'정사피',13,0,NULL);
/*!40000 ALTER TABLE `child_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consult_meeting_schdl`
--

DROP TABLE IF EXISTS `consult_meeting_schdl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consult_meeting_schdl` (
  `meeting_schdl_id` int NOT NULL AUTO_INCREMENT,
  `schdl_dttm` datetime NOT NULL,
  `create_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_dttm` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `start_dttm` datetime NOT NULL,
  `status` enum('P','A','E') NOT NULL DEFAULT 'P' COMMENT 'pending, active, end',
  `host_id` int NOT NULL COMMENT '상담사 유저',
  `parent_user_id` int NOT NULL,
  `child_user_id` int NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`meeting_schdl_id`),
  UNIQUE KEY `session_id_UNIQUE` (`session_id`),
  KEY `FK_consultant_user_TO_consult_meeting_schdl_1` (`host_id`),
  KEY `FK_parent_user_TO_consult_meeting_schdl_1` (`parent_user_id`),
  KEY `FK_child_user_TO_consult_meeting_schdl_1` (`child_user_id`),
  CONSTRAINT `FK_child_user_TO_consult_meeting_schdl_1` FOREIGN KEY (`child_user_id`) REFERENCES `child_user` (`child_user_id`),
  CONSTRAINT `FK_consultant_user_TO_consult_meeting_schdl_1` FOREIGN KEY (`host_id`) REFERENCES `consultant_user` (`consultant_user_id`),
  CONSTRAINT `FK_parent_user_TO_consult_meeting_schdl_1` FOREIGN KEY (`parent_user_id`) REFERENCES `parent_user` (`parent_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consult_meeting_schdl`
--

LOCK TABLES `consult_meeting_schdl` WRITE;
/*!40000 ALTER TABLE `consult_meeting_schdl` DISABLE KEYS */;
INSERT INTO `consult_meeting_schdl` VALUES (1,'2025-02-16 23:00:00','2025-02-16 19:47:29','2025-02-20 12:02:07',NULL,'2025-02-16 23:00:00','E',0,4,2,'dc56cd8a-6bb5-46bf-a142-97dc1578f80c'),(2,'2025-02-20 16:00:00','2025-02-17 01:42:52','2025-02-20 02:22:15','2025-02-20 02:22:16','2025-02-20 15:50:00','P',0,4,2,NULL),(3,'2025-02-18 02:00:00','2025-02-18 02:00:00','2025-02-20 12:02:07',NULL,'2025-02-17 01:50:00','E',0,4,2,'56faa4ab-d618-494d-8c80-e74d2c020a2f'),(6,'2025-02-18 17:00:00','2025-02-18 17:17:04','2025-02-20 12:02:07',NULL,'2025-02-18 16:50:00','E',4,1,11,NULL),(7,'2025-02-19 09:00:00','2025-02-19 09:39:17','2025-02-20 12:02:07',NULL,'2025-02-19 08:50:00','E',4,1,11,NULL),(8,'2025-02-19 10:00:00','2025-02-19 10:51:58','2025-02-20 12:02:07',NULL,'2025-02-19 09:50:00','E',4,1,11,NULL),(9,'2025-02-19 11:00:00','2025-02-19 11:39:52','2025-02-20 12:02:07',NULL,'2025-02-19 10:50:00','E',4,1,11,NULL),(10,'2025-02-19 13:00:00','2025-02-19 13:02:56','2025-02-20 12:02:07',NULL,'2025-02-19 12:50:00','E',4,1,11,'5243cfc1-88f1-4c52-b99c-704a729713cb'),(11,'2025-02-22 14:00:00','2025-02-19 14:20:02','2025-02-19 14:28:29','2025-02-19 14:28:30','2025-02-22 13:50:00','P',0,4,2,NULL),(12,'2025-02-19 15:00:00','2025-02-19 15:07:13','2025-02-20 12:02:07','2025-02-19 15:07:52','2025-02-19 14:50:00','E',4,1,11,NULL),(13,'2025-02-20 11:00:00','2025-02-20 11:51:58','2025-02-20 12:02:07',NULL,'2025-02-20 10:50:00','E',4,1,11,'87c1da0d-c00a-4b87-aedf-97823abbd792'),(14,'2025-02-20 11:00:00','2025-02-20 11:52:16','2025-02-20 12:02:07','2025-02-20 11:57:08','2025-02-20 10:50:00','E',3,10,10,NULL),(15,'2025-02-20 17:00:00','2025-02-20 17:24:59','2025-02-20 17:41:44','2025-02-20 17:41:44','2025-02-20 16:50:00','A',0,4,9,'8df6811f-e997-436a-ac5e-9e029a611728'),(17,'2025-02-20 17:00:00','2025-02-20 17:47:33','2025-02-20 17:47:45',NULL,'2025-02-20 16:50:00','A',0,4,2,'f167e3ce-561f-4641-8d96-44f0f582ccb4'),(18,'2025-02-21 09:00:00','2025-02-20 20:40:12','2025-02-20 20:40:12',NULL,'2025-02-21 08:50:00','P',0,4,2,NULL),(19,'2025-02-20 20:00:00','2025-02-20 20:53:45','2025-02-20 20:53:45',NULL,'2025-02-20 19:50:00','P',4,1,11,NULL),(20,'2025-02-20 21:00:00','2025-02-20 20:53:55','2025-02-20 21:21:07',NULL,'2025-02-20 20:50:00','A',4,1,11,'159d69f5-9af3-4a30-b9ee-ad6d27be4f64');
/*!40000 ALTER TABLE `consult_meeting_schdl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultant_user`
--

DROP TABLE IF EXISTS `consultant_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultant_user` (
  `consultant_user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `pwd` varchar(75) NOT NULL,
  `phone` char(13) NOT NULL,
  `create_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `update_dttm` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `center_id` int NOT NULL,
  `temp_pwd` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`consultant_user_id`),
  KEY `FK_center_TO_consultant_user_1` (`center_id`),
  CONSTRAINT `FK_center_TO_consultant_user_1` FOREIGN KEY (`center_id`) REFERENCES `center` (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultant_user`
--

LOCK TABLES `consultant_user` WRITE;
/*!40000 ALTER TABLE `consultant_user` DISABLE KEYS */;
INSERT INTO `consultant_user` VALUES (0,'정찬환','chanhoan01@gmail.com','$2a$10$krZy/NHp8lr/8C1VguDZAeUldqEIHAaSGzma8HxkY1BwC3sHK2nfu','01040562354','2025-01-25 17:45:35',NULL,'2025-02-04 10:31:40',1,0),(3,'박성원','psw123@gmail.com','$2a$10$krZy/NHp8lr/8C1VguDZAeUldqEIHAaSGzma8HxkY1BwC3sHK2nfu','01013246345','2025-02-17 11:28:36',NULL,'2025-02-18 17:16:02',1,0),(4,'상담사','abcd@gmail.com','$2a$10$IjUpfH5PhrFfkCTQ9hnhhe3cs7A/uStU77cm5ldWeUtQJn4/xc7JW','01012345678','2025-02-18 09:12:00',NULL,'2025-02-18 17:14:36',1,0);
/*!40000 ALTER TABLE `consultant_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delete_user_request`
--

DROP TABLE IF EXISTS `delete_user_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delete_user_request` (
  `delete_user_request_id` int NOT NULL AUTO_INCREMENT,
  `delete_request_dttm` datetime NOT NULL,
  `delete_confirm_dttm` datetime DEFAULT NULL,
  `status` enum('P','A','R') NOT NULL DEFAULT 'P' COMMENT 'pending, active, end',
  `parent_user_id` int NOT NULL,
  `consultant_user_id` int NOT NULL,
  PRIMARY KEY (`delete_user_request_id`),
  KEY `FK_parent_user_TO_delete_user_request_1` (`parent_user_id`),
  KEY `FK_consultant_user_TO_delete_user_request_1` (`consultant_user_id`),
  CONSTRAINT `FK_consultant_user_TO_delete_user_request_1` FOREIGN KEY (`consultant_user_id`) REFERENCES `consultant_user` (`consultant_user_id`),
  CONSTRAINT `FK_parent_user_TO_delete_user_request_1` FOREIGN KEY (`parent_user_id`) REFERENCES `parent_user` (`parent_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delete_user_request`
--

LOCK TABLES `delete_user_request` WRITE;
/*!40000 ALTER TABLE `delete_user_request` DISABLE KEYS */;
INSERT INTO `delete_user_request` VALUES (5,'2025-02-01 21:32:49','2025-02-01 21:56:21','R',4,0),(6,'2025-02-01 21:40:07','2025-02-16 12:53:53','R',4,0),(7,'2025-02-06 01:40:56','2025-02-17 01:19:10','A',8,0),(8,'2025-02-16 13:22:44','2025-02-17 01:58:06','A',4,0),(9,'2025-02-18 10:16:03','2025-02-18 10:30:54','R',4,0),(10,'2025-02-19 10:25:47','2025-02-19 10:26:03','A',12,0);
/*!40000 ALTER TABLE `delete_user_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emotion`
--

DROP TABLE IF EXISTS `emotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emotion` (
  `emotion_id` int NOT NULL AUTO_INCREMENT,
  `emo` varchar(20) NOT NULL,
  PRIMARY KEY (`emotion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emotion`
--

LOCK TABLES `emotion` WRITE;
/*!40000 ALTER TABLE `emotion` DISABLE KEYS */;
INSERT INTO `emotion` VALUES (1,'기쁨'),(2,'슬픔'),(3,'화남'),(4,'공포'),(5,'놀람');
/*!40000 ALTER TABLE `emotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `faq_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `faq_ans` text NOT NULL,
  `consultant_user_id` int NOT NULL,
  `type` enum('usage','child','center') NOT NULL,
  PRIMARY KEY (`faq_id`),
  KEY `FK_consultant_user_TO_faq_1` (`consultant_user_id`),
  CONSTRAINT `FK_consultant_user_TO_faq_1` FOREIGN KEY (`consultant_user_id`) REFERENCES `consultant_user` (`consultant_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,'센터의 이용 가능 시간이 어떻게 되나요?','<p>안녕하세요</p><p>하이파이브 센터 입니다.</p><p>센터의 이용 가능 시간에 대해 알려드립니다.</p><p><br></p><p>저희 센터는 평일 오전 9시 부터 오후 6사 꺼자 운영되고 있으며</p><p>휴일 및 공휴일에는 휴무입니다.</p><p><br></p><p>감사합니다.</p>',3,'center'),(2,'센터에 방문 하려면 어떻게 해야 하나요?','<p>안녕하세요</p><p>하이파이브 센터 입니다.</p><p><br></p><p>저희 센터는 누구나 방문 가능한 센터입니다.</p><p>운영 시간은 오전 9시부터 오후 6시까지이니 아무 때나 방문하셔도 됩니다.</p><p>방문 전 전화를 주시면 더욱 원활한 방문이 가능합니다.</p><p><br></p><p>감사합니다.</p>',3,'center'),(3,'주차 공간이 있나요?','<p>안녕하세요</p><p>하이파이브 센터입니다.</p><p><br></p><p>저희 센터는 건물 내 지하 1층에 무료 주차가 가능합니다.</p><p><br></p><p>감사합니다.</p><p><br></p>',3,'center'),(4,'상담 시간이 얼마나 걸리나요?','<p>안녕하세요</p><p>하이파이브 센터입니다.</p><p><br></p><p>1회 상담은 약 50분~1시간 정도 소요됩니다.</p><p><br></p><p>감사합니다.</p>',3,'center'),(5,'상담 내용은 비밀이 보장되나요?','<p>안녕하세요</p><p>하이파이브 센터입니다.</p><p><br></p><p> 모든 상담 내용은 비밀이 보장되며, 상담자 동의 없이 외부로 절대 유출되지 않습니다.</p><p><br></p><p>감사합니다.</p>',3,'center');
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `file_path` varchar(255) NOT NULL,
  `origin_file_name` varchar(255) NOT NULL,
  `upload_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `tbl_type` enum('PCD','PCT','NE','NF','QE','QF','G','FE','FF') DEFAULT NULL,
  `tbl_id` int NOT NULL COMMENT '유저일련번호, 게시판 일련번호, 게임 일련번호 등',
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=438 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (27,'PCD/2/921318e77423496fb96977d010a4912d_againCh.png','againCh.png','2025-02-16 13:56:28',NULL,'PCD',2),(28,'PCD/9/bb0bd83c120c435e833a57ebe5cbcffd_user.png','user.png','2025-02-16 13:57:28',NULL,'PCD',9),(29,'QE/5/5cdf374687454bf79f0195c04ab1f7eb_editor_image_0.png','editor_image_0.png','2025-02-16 14:14:48',NULL,'QE',5),(30,'QE/6/43feaf1a8b724b3681bc07c408948f93_editor_image_0.png','editor_image_0.png','2025-02-16 14:15:43','2025-02-16 14:18:28','QE',6),(31,'QE/7/e7a25b5fbbcd4cc9800ecfb70d139007_editor_image_0.png','editor_image_0.png','2025-02-16 14:18:00','2025-02-16 14:18:25','QE',7),(32,'QF/5/c01b45b5320e4fd184fc4d50514670c8_user.png','user.png','2025-02-16 14:18:39',NULL,'QF',5),(33,'QF/10/9f469acd16f84e57bf9baa246886aec9_image (14).png','image (14).png','2025-02-17 10:21:26',NULL,'QF',10),(34,'QE/11/5581ebd018c84f5fbc1bf6cafce3d176_editor_image_0.png','editor_image_0.png','2025-02-17 10:22:14','2025-02-17 10:22:41','QE',11),(35,'QE/12/9a4f580183384e58982680435491fe54_editor_image_0.png','editor_image_0.png','2025-02-17 10:22:22','2025-02-17 10:22:36','QE',12),(36,'QE/13/e299415180d64bf49e5d21892921f719_editor_image_0.png','editor_image_0.png','2025-02-17 10:23:00','2025-02-17 10:23:17','QE',13),(37,'QF/14/c80dee6a82564b398800ad23ef728350_놀람.png','놀람.png','2025-02-17 10:23:36',NULL,'QF',14),(38,'QE/15/b7fb61ca9a0b4692a4c69b8f5013b193_editor_image_0.png','editor_image_0.png','2025-02-17 10:24:13',NULL,'QE',15),(39,'QE/17/3f3b2a69e7774081b94887bfa79272c2_editor_image_0.png','editor_image_0.png','2025-02-17 10:28:30','2025-02-17 10:29:01','QE',17),(40,'QE/18/a75b318128ca4f3ea7d71fa3078cffe4_editor_image_0.png','editor_image_0.png','2025-02-17 10:29:25',NULL,'QE',18),(41,'QE/20/2f24f4ae9b62453f9cfa39bcea631eb6_editor_image_0.png','editor_image_0.png','2025-02-17 10:42:26',NULL,'QE',20),(42,'QE/21/bead3ab4d3664f3ebfa7883f64c2faf3_editor_image_0.png','editor_image_0.png','2025-02-17 10:42:55',NULL,'QE',21),(43,'QE/22/28c8e4090fd84c6aa59e5fd90947ae22_editor_image_0.png','editor_image_0.png','2025-02-17 10:54:35','2025-02-17 10:55:32','QE',22),(44,'QE/23/7235e865b16a4ca3a51543272166e621_editor_image_0.png','editor_image_0.png','2025-02-17 10:55:10','2025-02-17 10:55:26','QE',23),(45,'QE/24/19cdb1f6f7104a8e9f386bdda5ba66e1_editor_image_0.png','editor_image_0.png','2025-02-17 10:55:51',NULL,'QE',24),(46,'QE/26/36e7a91e61054eabb4d8db42d06f2343_editor_image_0.png','editor_image_0.png','2025-02-17 13:08:15',NULL,'QE',26),(47,'QE/27/ce3bb23fa88047699c375c12765b026a_editor_image_0.png','editor_image_0.png','2025-02-17 13:08:45',NULL,'QE',27),(48,'NE/22/1b8fb68e3efe423f928cf62d89435745_editor_image_0.png','editor_image_0.png','2025-02-17 13:09:46','2025-02-17 13:10:06','NE',22),(49,'G/2/9688c2ceec21461ab49d658e5a09cd9f_recording.webm','recording.webm','2025-02-19 02:44:49',NULL,'G',2),(50,'G/2/fb800b0afaa54b73b69df3155123c194_recording.webm','recording.webm','2025-02-19 02:44:58',NULL,'G',2),(51,'G/2/780a0ae1768341e3bd8a1ae82fd8af90_recording.webm','recording.webm','2025-02-19 02:45:07',NULL,'G',2),(52,'G/2/845820f1d1e74e1dbb15cf625f1eecd4_recording.webm','recording.webm','2025-02-19 02:45:14',NULL,'G',2),(53,'G/2/5ad7747bb1b7428e8a32574574e3f8ed_recording.webm','recording.webm','2025-02-19 02:45:21',NULL,'G',2),(54,'G/2/291f99b7d5c149959730f09c9825607d_recording.webm','recording.webm','2025-02-19 03:06:42',NULL,'G',2),(55,'G/2/5b9cd6beb2374edda1825af104be9f20_recording.webm','recording.webm','2025-02-19 03:06:49',NULL,'G',2),(56,'G/2/55fadbf2efca47878b3c4c65fdbf077c_recording.webm','recording.webm','2025-02-19 03:06:57',NULL,'G',2),(57,'G/2/1b2af37aedf741398c6652d4b6c7a4b4_recording.webm','recording.webm','2025-02-19 03:07:05',NULL,'G',2),(58,'G/2/0048a239d60d405b90c07936f363682a_recording.webm','recording.webm','2025-02-19 03:07:12',NULL,'G',2),(59,'G/2/4d000264d7cb472390f11645cfc65151_recording.webm','recording.webm','2025-02-19 09:21:30',NULL,'G',2),(60,'G/2/14cfb48896f54f688e50a826bb7b658f_recording.webm','recording.webm','2025-02-19 09:21:47',NULL,'G',2),(61,'G/2/07bfe9781bb844b29c2663d8f01a54b6_recording.webm','recording.webm','2025-02-19 09:22:00',NULL,'G',2),(62,'G/2/a8314d2d9a8d4e9d91e51aef095a6fd4_recording.webm','recording.webm','2025-02-19 09:22:10',NULL,'G',2),(63,'G/2/a88768c507f44a50922cc5339d3c037a_recording.webm','recording.webm','2025-02-19 09:22:19',NULL,'G',2),(64,'PCT/0/6740433b04f04fe3a18aa7ab6986170a_image.png','image.png','2025-02-19 10:00:07',NULL,'PCT',0),(65,'PCD/12/56c99a5d49f040e480c477e09bc2b151_Cap 2025-02-19 10-15-50-256.jpg','Cap 2025-02-19 10-15-50-256.jpg','2025-02-19 10:18:51',NULL,'PCD',12),(66,'PCD/13/a8422e1e2d0643db847a766f8aa8da21_Cap 2025-02-19 10-15-50-256.jpg','Cap 2025-02-19 10-15-50-256.jpg','2025-02-19 10:24:07',NULL,'PCD',13),(67,'G/2/2ae1b86e56cf41aca52415103407401d_recording.webm','recording.webm','2025-02-19 11:15:49',NULL,'G',2),(68,'G/2/1459b13b578d4a49af34c1e5d5cf3bc3_recording.webm','recording.webm','2025-02-19 11:17:25',NULL,'G',2),(69,'G/2/cd889b2d29f04e009733e36a8a3879c8_recording.webm','recording.webm','2025-02-19 11:17:33',NULL,'G',2),(70,'G/2/4bc62b28fa714e8f96df61ede274f8f5_recording.webm','recording.webm','2025-02-19 11:17:41',NULL,'G',2),(71,'G/2/8b1fd045e23745c8842d3000b0c11bac_recording.webm','recording.webm','2025-02-19 11:17:55',NULL,'G',2),(72,'G/2/86e08ce5b479438f9983d3a6de05010a_recording.webm','recording.webm','2025-02-19 11:52:22',NULL,'G',2),(73,'G/2/fb110758ecd94955a50326ffe36abf57_recording.webm','recording.webm','2025-02-19 11:52:30',NULL,'G',2),(74,'G/2/374f1fcc7bd44f79933777ee271e0fe8_recording.webm','recording.webm','2025-02-19 11:52:41',NULL,'G',2),(75,'G/2/e2e7fa2ec7584d90a14638082519ec1e_recording.webm','recording.webm','2025-02-19 11:52:48',NULL,'G',2),(76,'G/2/684a3f2aaae74416b71b610a76746890_recording.webm','recording.webm','2025-02-19 11:52:54',NULL,'G',2),(77,'G/2/013dc65638ce4c7e99f3bb54b900c5f8_recording.webm','recording.webm','2025-02-19 11:54:30',NULL,'G',2),(78,'G/2/ce2ea039221b4d719f4afdb4f5fcdb43_recording.webm','recording.webm','2025-02-19 11:54:35',NULL,'G',2),(79,'G/2/7251ca328205437cbc2754630f2fefed_recording.webm','recording.webm','2025-02-19 11:54:43',NULL,'G',2),(80,'G/2/a61a3105c3d0494aaee06e8f85ecb176_recording.webm','recording.webm','2025-02-19 11:54:50',NULL,'G',2),(81,'G/2/a0fe55359a244baf91e24b85be2194d7_recording.webm','recording.webm','2025-02-19 11:57:13',NULL,'G',2),(82,'G/2/3e85e41ac6094187a484f683d31b19d7_recording.webm','recording.webm','2025-02-19 11:57:19',NULL,'G',2),(83,'G/2/a336b0b1b05e451c9c827f9e485d296b_recording.webm','recording.webm','2025-02-19 11:57:27',NULL,'G',2),(84,'G/2/1f3aaafd98364250ba0b1fdb6cdacaba_recording.webm','recording.webm','2025-02-19 11:58:04',NULL,'G',2),(85,'G/2/7c4d2bb6091140ed88ec9b1894e324f6_recording.webm','recording.webm','2025-02-19 11:58:07',NULL,'G',2),(86,'G/2/fd799ccb6d3f4935946ec1c7ea3ef271_recording.webm','recording.webm','2025-02-19 11:58:11',NULL,'G',2),(87,'G/2/420f908637bd43dea6fa5d4bd048e529_recording.webm','recording.webm','2025-02-19 11:58:18',NULL,'G',2),(88,'G/2/6ab25a7e22f84f06be83b9512a5dc7db_recording.webm','recording.webm','2025-02-19 11:58:26',NULL,'G',2),(89,'G/2/b6f92f00feb24c82bfe464094680fb05_recording.webm','recording.webm','2025-02-19 11:59:07',NULL,'G',2),(90,'G/2/0ef45dd3bc5f4cc699ab5df9dfbea6d6_recording.webm','recording.webm','2025-02-19 11:59:13',NULL,'G',2),(91,'G/2/69ed6027b0f84ee39601233588530a89_recording.webm','recording.webm','2025-02-19 11:59:21',NULL,'G',2),(92,'G/2/51ea8e3ec549486d8b7bdf54d58dacb8_recording.webm','recording.webm','2025-02-19 12:00:02',NULL,'G',2),(93,'G/2/115b60f44d1849359a9a659bb938f799_recording.webm','recording.webm','2025-02-19 12:00:08',NULL,'G',2),(94,'G/2/34d8267f04a24e23b971b17e73589bd6_recording.webm','recording.webm','2025-02-19 12:00:14',NULL,'G',2),(95,'G/2/a1eaadaa49d14c088e9ef51bd0b0fbf5_recording.webm','recording.webm','2025-02-19 12:00:58',NULL,'G',2),(96,'G/2/eaaae99ad2de4dc49a59a0e5dd6e2934_recording.webm','recording.webm','2025-02-19 12:01:04',NULL,'G',2),(97,'G/2/e9f17ce688f542149b28903f0f98dc65_recording.webm','recording.webm','2025-02-19 12:01:13',NULL,'G',2),(98,'G/2/f68ccdbf9451406a9d719e87da85fa29_recording.webm','recording.webm','2025-02-19 12:10:33',NULL,'G',2),(99,'G/2/d71a7a1d38b94600ab61cf06d617c884_recording.webm','recording.webm','2025-02-19 12:10:40',NULL,'G',2),(100,'G/2/fd6b34939f8b4271b1fde7b162b8e605_recording.webm','recording.webm','2025-02-19 12:10:49',NULL,'G',2),(101,'G/2/ae2b647309cd4937b892b780da005835_recording.webm','recording.webm','2025-02-19 12:12:50',NULL,'G',2),(102,'G/2/3508dfe073144a7a8f379219db5a249c_recording.webm','recording.webm','2025-02-19 12:12:58',NULL,'G',2),(103,'G/2/92fd2ff78fc1494ab55b52058dffc563_recording.webm','recording.webm','2025-02-19 12:13:13',NULL,'G',2),(104,'G/2/bf2d65b984bc41f08d84b18703f38535_recording.webm','recording.webm','2025-02-19 13:17:06',NULL,'G',2),(105,'G/2/c3c12ee405a5487d9540ba0d75a71f29_recording.webm','recording.webm','2025-02-19 13:17:18',NULL,'G',2),(106,'G/2/1eef999eafa645318ed89cdf5b17b2d9_recording.webm','recording.webm','2025-02-19 13:19:48',NULL,'G',2),(107,'G/2/89761616769840628eae01af93b8197e_recording.webm','recording.webm','2025-02-19 13:19:55',NULL,'G',2),(108,'G/2/e4e6fe998aa24d038df6e40ab0e4fa93_recording.webm','recording.webm','2025-02-19 13:21:32',NULL,'G',2),(109,'G/2/c7fceca505344207b1042d504f68bd8b_recording.webm','recording.webm','2025-02-19 13:21:45',NULL,'G',2),(110,'G/2/f5475b1d18554ddd8acbcfc9520ab64a_recording.webm','recording.webm','2025-02-19 13:21:59',NULL,'G',2),(111,'G/2/bb8e016afa194895807629a43717c9ed_recording.webm','recording.webm','2025-02-19 13:23:10',NULL,'G',2),(112,'G/2/d0ee3cc341f741babcfaaf8a391a765a_recording.webm','recording.webm','2025-02-19 13:23:30',NULL,'G',2),(113,'G/2/cdba711721fb46b0af5ce4d892be35de_recording.webm','recording.webm','2025-02-19 13:23:38',NULL,'G',2),(114,'G/2/17621fc9bd1844e88c3468a3aa89192f_recording.webm','recording.webm','2025-02-19 13:25:27',NULL,'G',2),(115,'G/2/fbae8877b96d4fe88d04142b6ebf0be9_recording.webm','recording.webm','2025-02-19 13:27:34',NULL,'G',2),(116,'G/2/850a43170ab5486e9f949668f669c166_recording.webm','recording.webm','2025-02-19 13:28:02',NULL,'G',2),(117,'G/2/72777627ba534cb8b25169099bee42fc_recording.webm','recording.webm','2025-02-19 13:54:42',NULL,'G',2),(118,'G/2/8042b95a8f5c4f1093abfc0991770bb0_recording.webm','recording.webm','2025-02-19 13:55:00',NULL,'G',2),(119,'G/2/3d669f91c836487086b172faec288aa5_recording.webm','recording.webm','2025-02-19 13:56:01',NULL,'G',2),(120,'G/2/40ab1dd7606344fc9a61fe0a93fc437c_recording.webm','recording.webm','2025-02-19 13:58:25',NULL,'G',2),(121,'G/2/947b05f020114b7c90641434f7c98b3e_recording.webm','recording.webm','2025-02-19 13:58:46',NULL,'G',2),(122,'G/2/5ab37916a1ed4bb5b040d8f66c80c4a1_recording.webm','recording.webm','2025-02-19 13:59:11',NULL,'G',2),(123,'G/2/f0c9b1d04b6e403598f88b2a711425e4_recording.webm','recording.webm','2025-02-19 13:59:56',NULL,'G',2),(124,'G/2/c94383b7125945cabc1178debf876b68_recording.webm','recording.webm','2025-02-19 14:15:43',NULL,'G',2),(125,'G/2/de31e6bd89164fd0b26dcd7224b5b37a_recording.webm','recording.webm','2025-02-19 14:21:00',NULL,'G',2),(126,'G/2/fce530aa4f9e40a6920463c82d7d2224_recording.webm','recording.webm','2025-02-19 14:22:52',NULL,'G',2),(127,'G/2/41c1d0f2eb3742cba30ce89b8f5c784a_recording.webm','recording.webm','2025-02-19 14:23:30',NULL,'G',2),(128,'G/2/eb44994c97794ee3818c7b42a938246a_recording.webm','recording.webm','2025-02-19 14:26:28',NULL,'G',2),(129,'G/2/91c87361781a410b852eeaae0d27064c_recording.webm','recording.webm','2025-02-19 14:27:10',NULL,'G',2),(130,'G/2/4812bb76334e426fbed1b2ab11115c3a_recording.webm','recording.webm','2025-02-19 14:27:50',NULL,'G',2),(131,'G/2/4a5cefb9396f485ebb52e9b22c5f3060_recording.webm','recording.webm','2025-02-19 14:27:59',NULL,'G',2),(132,'G/2/ae8d8283a9534b6fb20dd1522562f6a7_recording.webm','recording.webm','2025-02-19 14:28:08',NULL,'G',2),(133,'G/2/12b19701449446438b2e37f66011d0ab_recording.webm','recording.webm','2025-02-19 14:41:39',NULL,'G',2),(134,'G/2/c04f8f89eaa94f319ceff71556aa956a_recording.webm','recording.webm','2025-02-19 14:41:48',NULL,'G',2),(135,'G/2/30ec12c0bb054a5bb6d17406c920f179_recording.webm','recording.webm','2025-02-19 14:42:45',NULL,'G',2),(136,'G/2/aa01f401006a42669b3b9ecabbff547c_recording.webm','recording.webm','2025-02-19 14:42:50',NULL,'G',2),(137,'G/2/c728e7fce627447aa2c2529942a069e4_recording.webm','recording.webm','2025-02-19 14:44:13',NULL,'G',2),(138,'G/2/63f07c801e854cc4b38c91dd908be4b4_recording.webm','recording.webm','2025-02-19 14:45:06',NULL,'G',2),(139,'G/2/486d627c09bf429fb5c5feff22253f41_recording.webm','recording.webm','2025-02-19 14:47:17',NULL,'G',2),(140,'G/2/a07343cc64d14ad4ab590ed1724bf0ed_recording.webm','recording.webm','2025-02-19 14:47:48',NULL,'G',2),(141,'G/2/27f30216c94646c8ba7a07cfebf01043_recording.webm','recording.webm','2025-02-19 14:51:01',NULL,'G',2),(142,'G/2/d005f6c53f5f41f89a4de7ff0b707606_recording.webm','recording.webm','2025-02-19 14:51:16',NULL,'G',2),(143,'G/2/853e94aaf67149a9ae63d9c2edee59e3_recording.webm','recording.webm','2025-02-19 14:52:03',NULL,'G',2),(144,'G/2/a78c4f6ca8934f918da010d75ffa512e_recording.webm','recording.webm','2025-02-19 14:53:19',NULL,'G',2),(145,'G/2/7335c4292f444ae2a9cc6d7fb1e8f8fa_recording.webm','recording.webm','2025-02-19 14:55:56',NULL,'G',2),(146,'G/2/fcb9aabc10cf4270b3edd3de7ffd74e4_recording.webm','recording.webm','2025-02-19 14:58:23',NULL,'G',2),(147,'G/2/cfa598c341f94479a3a0d169d15c3f38_recording.webm','recording.webm','2025-02-19 14:58:36',NULL,'G',2),(148,'G/2/dfa155b7440a4a208db99ee9383faf73_recording.webm','recording.webm','2025-02-19 14:58:45',NULL,'G',2),(149,'G/2/aa0643ca76b1485190116389a511bc1d_recording.webm','recording.webm','2025-02-19 14:59:15',NULL,'G',2),(150,'G/2/4457f22fddbd4a28a0d6d7e4795334e5_recording.webm','recording.webm','2025-02-19 14:59:26',NULL,'G',2),(151,'G/2/ebdb2be6bddc4f65a37bace15eae30bc_recording.webm','recording.webm','2025-02-19 14:59:48',NULL,'G',2),(152,'G/2/905fa78fcfb2421486f43e8032b2f6a9_recording.webm','recording.webm','2025-02-19 14:59:59',NULL,'G',2),(153,'G/2/51bb611f65cc42398eebef48e665dce5_recording.webm','recording.webm','2025-02-19 15:02:15',NULL,'G',2),(154,'G/2/e041d3e4067748e18c621035b2450b9d_recording.webm','recording.webm','2025-02-19 15:04:44',NULL,'G',2),(155,'G/2/a3e68722e428422c9303585e369206c9_recording.webm','recording.webm','2025-02-19 15:04:56',NULL,'G',2),(156,'G/2/79eae5f8d6e34181a6dd1d81eb041f9b_recording.webm','recording.webm','2025-02-19 15:05:11',NULL,'G',2),(157,'G/2/3a5ea02985344f508cdffdf6a0299392_recording.webm','recording.webm','2025-02-19 15:05:25',NULL,'G',2),(158,'G/2/aae7b92d457a4b2eb181bd57217f1c24_recording.webm','recording.webm','2025-02-19 15:05:38',NULL,'G',2),(159,'G/2/c1f185e10c5b468e844abfc9d31eda49_recording.webm','recording.webm','2025-02-19 15:05:53',NULL,'G',2),(160,'G/2/a692017ace78426e8839fd1b3fe5cb6a_recording.webm','recording.webm','2025-02-19 15:07:50',NULL,'G',2),(161,'G/2/870856b0a5fa4dabb804e2e322993b85_recording.webm','recording.webm','2025-02-19 15:08:03',NULL,'G',2),(162,'G/2/393b13f773a44c5facf17e4455a04728_recording.webm','recording.webm','2025-02-19 15:08:11',NULL,'G',2),(163,'G/2/e3c27d2e2f4a4e24bdc16e10befb670a_recording.webm','recording.webm','2025-02-19 15:08:20',NULL,'G',2),(164,'G/2/e7e40ab610a24a8fab73a1cbaaa1dea5_recording.webm','recording.webm','2025-02-19 15:13:22',NULL,'G',2),(165,'G/2/8de6dc80a7a0454c887e6d2fca9e3895_recording.webm','recording.webm','2025-02-19 15:13:40',NULL,'G',2),(166,'G/2/5826ba9dee0a4d9a80c4b291ea1578c8_recording.webm','recording.webm','2025-02-19 15:13:55',NULL,'G',2),(167,'G/2/f1b461c14efa475298e2e88618e1f3ec_recording.webm','recording.webm','2025-02-19 15:14:03',NULL,'G',2),(168,'G/2/9856307ec59144689a00f66ba1dacdc5_recording.webm','recording.webm','2025-02-19 15:14:23',NULL,'G',2),(169,'G/2/b9773ce37ccc42069707fd6b6e7ce3ff_recording.webm','recording.webm','2025-02-19 15:22:00',NULL,'G',2),(170,'G/2/e2baa5f2e78e42338463ce00bee965e6_recording.webm','recording.webm','2025-02-19 15:22:17',NULL,'G',2),(171,'G/2/3fadab4b14844ea89f9ffb677d16e672_recording.webm','recording.webm','2025-02-19 15:23:00',NULL,'G',2),(172,'G/2/9bca0701651644149d2fe0a2cb674821_recording.webm','recording.webm','2025-02-19 15:23:14',NULL,'G',2),(173,'G/2/9a023333505a4537ba523a52b896bb22_recording.webm','recording.webm','2025-02-19 15:24:31',NULL,'G',2),(174,'G/2/41332d2253fc4837abce4ebf30d4810d_recording.webm','recording.webm','2025-02-19 15:26:28',NULL,'G',2),(175,'G/2/d3c93d7ff9084de4a7ee172bf2143a39_recording.webm','recording.webm','2025-02-19 15:26:40',NULL,'G',2),(176,'G/2/2117e47004d8470790774405e55a4483_recording.webm','recording.webm','2025-02-19 15:34:08',NULL,'G',2),(177,'G/2/a1baedcd8f1e4811bafce5731797786b_recording.webm','recording.webm','2025-02-19 15:35:07',NULL,'G',2),(178,'G/2/06bfec06e9c94b33b875782e7542bf06_recording.webm','recording.webm','2025-02-19 15:35:37',NULL,'G',2),(179,'G/2/41cec8f0ee664464911eff50d7b31edb_recording.webm','recording.webm','2025-02-19 15:41:28',NULL,'G',2),(180,'G/2/c420daa0250e47a0bd251d91d077aacf_recording.webm','recording.webm','2025-02-19 15:42:31',NULL,'G',2),(181,'G/2/2ba1a496139f43458033a68d77c57a28_recording.webm','recording.webm','2025-02-19 16:04:17',NULL,'G',2),(182,'G/2/c563318dcb614006a4ae7f3b18531b66_recording.webm','recording.webm','2025-02-19 16:04:31',NULL,'G',2),(183,'G/2/2cc9b99cc353495ea9dcc017c257c59b_recording.webm','recording.webm','2025-02-19 16:09:36',NULL,'G',2),(184,'G/2/6f27588bd3b54d2c8df1c59bef9c74b9_recording.webm','recording.webm','2025-02-19 16:09:52',NULL,'G',2),(185,'G/2/471e221b76b0476b9fa163ec069de94b_recording.webm','recording.webm','2025-02-19 16:13:46',NULL,'G',2),(186,'G/2/ecc954f18de641d9a8069cf1cb850ab1_recording.webm','recording.webm','2025-02-19 16:14:00',NULL,'G',2),(187,'G/2/c369896513614741bd79627b48c7a844_recording.webm','recording.webm','2025-02-19 16:18:46',NULL,'G',2),(188,'G/2/eebd7b3fc1f545079c8adb5bbe515df1_recording.webm','recording.webm','2025-02-19 16:19:03',NULL,'G',2),(189,'G/2/ee4458d7d6524402915c701d4e0e8a17_recording.webm','recording.webm','2025-02-19 16:20:59',NULL,'G',2),(190,'G/2/92818464009342789e1b0c7ae2d90b9b_recording.webm','recording.webm','2025-02-19 16:24:01',NULL,'G',2),(191,'G/2/2673cf9c70b44e628ac6545f12a66f08_recording.webm','recording.webm','2025-02-19 16:26:12',NULL,'G',2),(192,'G/2/6a9e8fd77fd54e98adeba56fd7b058e0_recording.webm','recording.webm','2025-02-19 16:26:28',NULL,'G',2),(193,'G/2/eee90c44b6cd4d90a006816c183ef09e_recording.webm','recording.webm','2025-02-19 16:30:27',NULL,'G',2),(194,'G/2/973c5e92b80145e7a1146a894eb87b63_recording.webm','recording.webm','2025-02-19 16:30:42',NULL,'G',2),(195,'G/2/89c3c0efa3314d4ebd841a60a994bc8c_recording.webm','recording.webm','2025-02-19 16:32:43',NULL,'G',2),(196,'G/2/adb176f679e546c6864a0ed67bcdc937_recording.webm','recording.webm','2025-02-19 16:32:56',NULL,'G',2),(197,'G/2/3af90bede4c744659b66b0f5d874ce74_recording.webm','recording.webm','2025-02-19 16:36:22',NULL,'G',2),(198,'G/2/718eddf38c2344e9bd4e7ec44546cce6_recording.webm','recording.webm','2025-02-19 16:36:36',NULL,'G',2),(199,'G/2/1db4ec9ad3534db09c0ed3f1ef2addff_recording.webm','recording.webm','2025-02-19 16:39:31',NULL,'G',2),(200,'G/2/0b9fc0db5a524f4493facf6e6ce3e88a_recording.webm','recording.webm','2025-02-19 16:39:47',NULL,'G',2),(201,'G/2/0b71a635226f48d8b3256c764b292b87_recording.webm','recording.webm','2025-02-19 16:41:29',NULL,'G',2),(202,'G/2/aeb170bcb40641d99dee4c0bdffccbda_recording.webm','recording.webm','2025-02-19 16:41:46',NULL,'G',2),(203,'G/2/8563509e5ca54fb797b56e200175de43_recording.webm','recording.webm','2025-02-19 16:43:16',NULL,'G',2),(204,'G/2/78480008bd03425397fde74db25032b9_recording.webm','recording.webm','2025-02-19 16:43:35',NULL,'G',2),(205,'G/2/38bac1457b0743aaa4ddcee0ff308c7a_recording.webm','recording.webm','2025-02-19 16:45:00',NULL,'G',2),(206,'G/2/671204ae2b5b40b2bd0f095f2453c825_recording.webm','recording.webm','2025-02-19 16:49:46',NULL,'G',2),(207,'G/2/92732b6fb7654e5f803c6bffae1d7ae2_recording.webm','recording.webm','2025-02-19 16:50:01',NULL,'G',2),(208,'G/2/257d487cc6c64f9680ca0567af1c310f_recording.webm','recording.webm','2025-02-19 16:53:30',NULL,'G',2),(209,'G/2/3e1674c5723b486cb99434facbcfe295_recording.webm','recording.webm','2025-02-19 16:53:44',NULL,'G',2),(210,'G/2/786e6ef47fa64e49aaf20f94c7575c8d_recording.webm','recording.webm','2025-02-19 16:55:24',NULL,'G',2),(211,'G/2/60ee4525d2e94514838839e3dc332d7e_recording.webm','recording.webm','2025-02-19 16:55:36',NULL,'G',2),(212,'G/2/07871c68681f43f2b7d3fe12e86d7351_recording.webm','recording.webm','2025-02-19 17:06:05',NULL,'G',2),(213,'G/2/66e2c7c9ffb2482c8da50e56e502e949_recording.webm','recording.webm','2025-02-19 17:06:22',NULL,'G',2),(214,'G/2/1953b2f4b1d9459f97101f3bcfd6b92e_recording.webm','recording.webm','2025-02-19 17:10:51',NULL,'G',2),(215,'G/2/00cdb2fbaf5d46ec83572f7cdaf335bd_recording.webm','recording.webm','2025-02-19 17:12:42',NULL,'G',2),(216,'G/2/d3a787a9d27a402fabe330669213f3bb_recording.webm','recording.webm','2025-02-19 17:18:44',NULL,'G',2),(217,'G/2/427023b87dc149d39e19936e77a8c15c_recording.webm','recording.webm','2025-02-19 17:30:20',NULL,'G',2),(218,'G/2/cf12fd20c1734e018219f4b34d487ba2_recording.webm','recording.webm','2025-02-19 17:33:47',NULL,'G',2),(219,'G/2/4f0ab653aa4a4b52b69a13fd2c89f552_recording.webm','recording.webm','2025-02-19 17:35:24',NULL,'G',2),(220,'G/2/ca96d4587c424993aa329de6c4a30eb7_recording.webm','recording.webm','2025-02-19 17:36:21',NULL,'G',2),(221,'G/2/b8a52d59965a40858e931d454470762f_recording.webm','recording.webm','2025-02-19 17:36:38',NULL,'G',2),(222,'G/2/0fd42c6797f84193be34e5962f124037_recording.webm','recording.webm','2025-02-19 17:37:37',NULL,'G',2),(223,'G/2/bc450607c7c94a1686ef27c0ffb907a0_recording.webm','recording.webm','2025-02-19 17:37:54',NULL,'G',2),(224,'G/2/90d75e38bc3f4921b922fae6a15b09c8_recording.webm','recording.webm','2025-02-20 00:44:47',NULL,'G',2),(225,'G/2/aaef880f02ba44dc88112449fe96f295_recording.webm','recording.webm','2025-02-20 00:45:21',NULL,'G',2),(226,'G/0/3ec7e54e5c4842dd83dba516843cdfed_recording.webm','recording.webm','2025-02-20 00:48:50',NULL,'G',0),(227,'G/0/a08f277af6f64d1897b9b311976da009_recording.webm','recording.webm','2025-02-20 00:50:23',NULL,'G',0),(228,'G/13/1456b09608fd44959b10c20c375428aa_recording.webm','recording.webm','2025-02-20 00:50:57',NULL,'G',13),(229,'G/0/90f0e094ad3b406e9e4d077569f52c4d_recording.webm','recording.webm','2025-02-20 00:54:42',NULL,'G',0),(230,'G/0/b3b045b8962e4419a3254a3ef738e308_recording.webm','recording.webm','2025-02-20 00:55:04',NULL,'G',0),(231,'G/0/60457325ba844e95959647ddc592fab2_recording.webm','recording.webm','2025-02-20 00:55:22',NULL,'G',0),(232,'G/14/3b31ab0c00a7481092c9560f5cd94b4e_recording.webm','recording.webm','2025-02-20 00:55:53',NULL,'G',14),(233,'FE/6/9ecf81b66eb9468b801ddb14b4beece2_editor_image_0.png','editor_image_0.png','2025-02-20 01:07:40','2025-02-20 01:08:07','FE',6),(234,'FE/7/7d2bd577dd1d46eaa4bf23b350bb802a_editor_image_0.png','editor_image_0.png','2025-02-20 01:26:37','2025-02-20 01:27:02','FE',7),(235,'FE/8/dbe9e4bdfc404c539dd63975d0b856b7_editor_image_0.png','editor_image_0.png','2025-02-20 01:26:53','2025-02-20 01:26:58','FE',8),(236,'FE/10/eb3731a837cd465ebb8791aa36e76d8c_editor_image_0.png','editor_image_0.png','2025-02-20 01:30:56','2025-02-20 01:31:17','FE',10),(237,'FE/11/ffe071d87b7642909085d9551afcb9ab_editor_image_0.png','editor_image_0.png','2025-02-20 01:32:19','2025-02-20 01:32:24','FE',11),(238,'FE/12/720252b52ec44b988895cec047a3080c_editor_image_0.png','editor_image_0.png','2025-02-20 01:32:32','2025-02-20 01:33:03','FE',12),(239,'FE/13/ab101c5e407d49db96fda4ec5026607f_editor_image_0.png','editor_image_0.png','2025-02-20 01:34:00','2025-02-20 01:35:17','FE',13),(240,'FE/14/56afc21e5a3a4d2087a3924b0c348ec4_editor_image_0.png','editor_image_0.png','2025-02-20 01:35:10','2025-02-20 01:35:13','FE',14),(241,'FE/15/623ca77f7c634335a1310c13ba1af85c_editor_image_0.png','editor_image_0.png','2025-02-20 01:35:24','2025-02-20 01:35:29','FE',15),(242,'NE/9/97c15c03fd07476584432f3d07be45e2_editor_image_0.png','editor_image_0.png','2025-02-20 01:35:42','2025-02-20 01:35:51','NE',9),(243,'QE/29/c167197e9dbd41be89b938fb2d3dc1cd_editor_image_0.png','editor_image_0.png','2025-02-20 01:36:14','2025-02-20 01:37:57','QE',29),(244,'QE/30/15cac44f61b9421c957f10082f849a42_editor_image_0.png','editor_image_0.png','2025-02-20 01:37:42','2025-02-20 01:37:47','QE',30),(245,'QE/29/9c40a427448e48fb804e8a18cfa1e083_editor_image_0.png','editor_image_0.png','2025-02-20 01:57:34','2025-02-20 01:57:38','QE',29),(246,'QE/33/ff311bf4ad71446ab8d54a27ccd474a6_editor_image_0.png','editor_image_0.png','2025-02-20 01:57:45','2025-02-20 01:57:56','QE',33),(247,'QE/33/1aa33694794d40ed97f48757e9764700_editor_image_1.png','editor_image_1.png','2025-02-20 01:57:52','2025-02-20 01:57:56','QE',33),(248,'G/0/70aef43c0b6647c4b6dfc7d228a0477d_recording.webm','recording.webm','2025-02-20 02:57:54',NULL,'G',0),(249,'G/0/36466f52a47d4bc38f61dedd2099db07_recording.webm','recording.webm','2025-02-20 03:00:24',NULL,'G',0),(250,'G/0/4d81390e3a514630a6fefd5681aa3e94_recording.webm','recording.webm','2025-02-20 03:08:32',NULL,'G',0),(251,'G/0/e94d19394c3247d2bda2e63e7114dbdf_recording.webm','recording.webm','2025-02-20 06:10:36',NULL,'G',0),(252,'G/0/b90770cdac82412db6c79474e4e4cf78_recording.webm','recording.webm','2025-02-20 08:35:59',NULL,'G',0),(253,'G/0/e57b72fc7a9f4433ba9335ae06a05b22_recording.webm','recording.webm','2025-02-20 08:38:55',NULL,'G',0),(254,'G/0/653441404a1647db99dd20b1ef306fe4_recording.webm','recording.webm','2025-02-20 08:39:58',NULL,'G',0),(255,'G/0/b12141e0a4d641a59b62d6f9fa9bbd7a_recording.webm','recording.webm','2025-02-20 08:43:30',NULL,'G',0),(256,'G/0/64067af5b8b6437fb4eda215231164a3_recording.webm','recording.webm','2025-02-20 08:45:11',NULL,'G',0),(257,'G/0/6bcd2ccc10e94765b200c5afd2c3adff_recording.webm','recording.webm','2025-02-20 09:01:05',NULL,'G',0),(258,'G/0/678cb6f8a1c4455abbb5048ea8c45b41_recording.webm','recording.webm','2025-02-20 09:04:21',NULL,'G',0),(259,'G/0/ec569957cbe244d381496ab02ab29b05_recording.webm','recording.webm','2025-02-20 09:27:14',NULL,'G',0),(260,'G/0/76b76ee9c5e543b6813c752483ec9e6b_recording.webm','recording.webm','2025-02-20 09:27:56',NULL,'G',0),(261,'G/0/48f23f52b2be47f6817517365d8d3670_recording.webm','recording.webm','2025-02-20 09:28:03',NULL,'G',0),(262,'G/0/a70453e122514bdab270dec8074f3cd9_recording.webm','recording.webm','2025-02-20 09:28:30',NULL,'G',0),(263,'G/0/334f5bb138534aa1812cf25f6f3a6f81_recording.webm','recording.webm','2025-02-20 09:28:42',NULL,'G',0),(264,'G/0/785a6aec1a984c8fa3bed454960d95bd_recording.webm','recording.webm','2025-02-20 09:29:24',NULL,'G',0),(265,'G/0/34615176175b4e3281e41be91c27aa1e_recording.webm','recording.webm','2025-02-20 09:30:24',NULL,'G',0),(266,'G/0/676371ed37c342bda3b19ca81efe018c_recording.webm','recording.webm','2025-02-20 09:31:03',NULL,'G',0),(267,'G/0/17d0e8768e804f2296eed69b4939596e_recording.webm','recording.webm','2025-02-20 09:31:15',NULL,'G',0),(268,'G/0/34ab49530b2d4c94bb2715189044c5ac_recording.webm','recording.webm','2025-02-20 09:31:18',NULL,'G',0),(269,'G/0/5e4575f0800945cfaeec508dfe87474e_recording.webm','recording.webm','2025-02-20 09:31:28',NULL,'G',0),(270,'G/0/c4c33ee4bba54605bfc4edfac1a61987_recording.webm','recording.webm','2025-02-20 09:31:58',NULL,'G',0),(271,'G/0/9f1aaf3dbf42461c9fe449b460ebdcdf_recording.webm','recording.webm','2025-02-20 09:32:51',NULL,'G',0),(272,'G/0/55c1ada880344536a9c5739427375dda_recording.webm','recording.webm','2025-02-20 09:32:59',NULL,'G',0),(273,'G/0/092440b5509a43619740ccf460b10904_recording.webm','recording.webm','2025-02-20 09:33:28',NULL,'G',0),(274,'G/0/04af169baf7343818a98dce9dbf6c446_recording.webm','recording.webm','2025-02-20 09:34:01',NULL,'G',0),(275,'G/0/087827dae22445f2a64a232abd8252e8_recording.webm','recording.webm','2025-02-20 09:34:44',NULL,'G',0),(276,'G/0/ba8f313070a04e0aadcf57729d7a2aeb_recording.webm','recording.webm','2025-02-20 09:35:09',NULL,'G',0),(277,'G/0/4d63c0a54362482ba4b269addcd5d338_recording.webm','recording.webm','2025-02-20 09:35:19',NULL,'G',0),(278,'G/0/9a1ae7f8b78746308fd36ab9e44bfdf4_recording.webm','recording.webm','2025-02-20 09:36:02',NULL,'G',0),(279,'G/0/e19f1f4e357e459faaa60cd14a2b3dd1_recording.webm','recording.webm','2025-02-20 09:36:29',NULL,'G',0),(280,'G/0/c9121740702f430caf8003f98b6d483e_recording.webm','recording.webm','2025-02-20 09:37:30',NULL,'G',0),(281,'G/0/1ee8192b7bd94c30b85ae12c530f3739_recording.webm','recording.webm','2025-02-20 09:38:01',NULL,'G',0),(282,'G/0/cb3bf07c7ab04d38ac427a9ef50c7da9_recording.webm','recording.webm','2025-02-20 09:38:21',NULL,'G',0),(283,'G/0/a26a5df5c0174036926a79784d81be07_recording.webm','recording.webm','2025-02-20 09:39:18',NULL,'G',0),(284,'G/0/f008ac76bb4d48b5bacccb53f4dcf9f3_recording.webm','recording.webm','2025-02-20 09:39:51',NULL,'G',0),(285,'G/0/80ebd0d20c4644b09a6eb7df2da65fd3_recording.webm','recording.webm','2025-02-20 09:39:54',NULL,'G',0),(286,'G/0/adca578ea4724bc4bc5b3cbc63190c3c_recording.webm','recording.webm','2025-02-20 09:43:58',NULL,'G',0),(287,'G/0/f3ad06d876e846c1a1de72b6417ee990_recording.webm','recording.webm','2025-02-20 09:44:06',NULL,'G',0),(288,'G/0/295f7eb6027f4240b631ee00199cc52b_recording.webm','recording.webm','2025-02-20 10:21:28',NULL,'G',0),(289,'G/0/7c9651ee0bf445d0a99303966e4ccd91_recording.webm','recording.webm','2025-02-20 10:23:43',NULL,'G',0),(290,'G/0/9c8b22a0291d4970a0a76a724f97810a_recording.webm','recording.webm','2025-02-20 10:24:36',NULL,'G',0),(291,'G/0/69ea8b67326048a891f42c53cac69ea7_recording.webm','recording.webm','2025-02-20 10:26:46',NULL,'G',0),(292,'G/0/b73cc08bd15944ae91599fdb9326c239_recording.webm','recording.webm','2025-02-20 10:33:40',NULL,'G',0),(293,'G/0/dd0e03a1d43f46188a652b1183817a87_recording.webm','recording.webm','2025-02-20 10:34:04',NULL,'G',0),(294,'G/0/e03d5ddd758f4f90bb1dab5e84275194_recording.webm','recording.webm','2025-02-20 10:34:10',NULL,'G',0),(295,'G/0/a2c3d454193a44939f81ab33723180fb_recording.webm','recording.webm','2025-02-20 10:34:30',NULL,'G',0),(296,'G/0/f3eaada6e0594024821b2ed37ffbb47e_recording.webm','recording.webm','2025-02-20 10:34:42',NULL,'G',0),(297,'G/0/a09b1c356d354688a80f121f5f96705f_recording.webm','recording.webm','2025-02-20 10:35:20',NULL,'G',0),(298,'G/0/0f7ca68c2cf14dd48809992360210346_recording.webm','recording.webm','2025-02-20 10:40:33',NULL,'G',0),(299,'NF/11/6731e9d0327849478cb758e2e2c177ce_코드리뷰피라미드.png','코드리뷰피라미드.png','2025-02-20 10:46:38','2025-02-20 10:47:05','NF',11),(300,'NE/11/d75852da21d64974bd0b604d1f90341e_editor_image_0.png','editor_image_0.png','2025-02-20 10:47:23','2025-02-20 10:47:59','NE',11),(301,'NF/11/0ee5dfa9023b4ba3992311810f0fe00e_서울시, _모든 정비사업 통합심의_ 본격 시행… 재개발, 재건축 사업속도 가속화.pdf','서울시, _모든 정비사업 통합심의_ 본격 시행… 재개발, 재건축 사업속도 가속화.pdf','2025-02-20 10:47:23','2025-02-20 10:47:59','NF',11),(302,'G/0/c596b51b922d41819ec648747ba0068b_recording.webm','recording.webm','2025-02-20 10:51:08',NULL,'G',0),(303,'G/0/091dec1fe4b144aeb61b547b36bb9943_recording.webm','recording.webm','2025-02-20 10:51:31',NULL,'G',0),(304,'G/0/cd84b70253e84f6dba165f95c3fa8516_recording.webm','recording.webm','2025-02-20 10:55:42',NULL,'G',0),(305,'G/0/42865a22815647fdacf90c3ced6de51b_recording.webm','recording.webm','2025-02-20 11:00:16',NULL,'G',0),(306,'G/0/f5b0046c4d5c408090ab45290de023b4_recording.webm','recording.webm','2025-02-20 11:03:44',NULL,'G',0),(307,'G/0/470d2c733c234e8aa0aa67ae06314135_recording.webm','recording.webm','2025-02-20 11:04:23',NULL,'G',0),(308,'G/0/c1b8dfdf3b3b4d3cbaa9eba6e1469814_recording.webm','recording.webm','2025-02-20 11:08:32',NULL,'G',0),(309,'G/0/eb284260d1e84e0fbb096abd914ba3ea_recording.webm','recording.webm','2025-02-20 11:08:57',NULL,'G',0),(310,'G/0/c188fe1cdbc5471e96ce9e2c379a8f7d_recording.webm','recording.webm','2025-02-20 11:09:00',NULL,'G',0),(311,'G/0/6f022c0641884a3fb7b69dedcb3d1fe2_recording.webm','recording.webm','2025-02-20 11:09:05',NULL,'G',0),(312,'G/0/bf5b58672a814f86b8fb18981d6cfac6_recording.webm','recording.webm','2025-02-20 11:09:08',NULL,'G',0),(313,'G/0/14c7ba3760be4a7d80d2df92e6dffe29_recording.webm','recording.webm','2025-02-20 11:09:10',NULL,'G',0),(314,'G/0/f408e043e02c4c85a3d18f72d7b09716_recording.webm','recording.webm','2025-02-20 11:09:12',NULL,'G',0),(315,'G/0/b49f23cd3d274a9c9ad7dbbd3f04206a_recording.webm','recording.webm','2025-02-20 11:09:32',NULL,'G',0),(316,'G/0/b87f399c9996470e99c51a6a4cf088fc_recording.webm','recording.webm','2025-02-20 11:09:34',NULL,'G',0),(317,'G/0/5407b91a35b1447fb77a4be3435a99d7_recording.webm','recording.webm','2025-02-20 11:18:42',NULL,'G',0),(318,'G/0/653cf35d6918453087031c9649d06f0b_recording.webm','recording.webm','2025-02-20 11:27:30',NULL,'G',0),(319,'G/0/e2fb805f1f6a47a8a9647bb745625f04_recording.webm','recording.webm','2025-02-20 11:33:34',NULL,'G',0),(320,'G/0/2199db643560446497117d021f0e94b8_recording.webm','recording.webm','2025-02-20 11:34:10',NULL,'G',0),(321,'G/0/8453b1efbfc84ff38d1876e93e76efb0_recording.webm','recording.webm','2025-02-20 11:40:47',NULL,'G',0),(322,'G/0/285ac5b72011497a8099939e47c66c6a_recording.webm','recording.webm','2025-02-20 11:40:59',NULL,'G',0),(323,'G/0/558dd0008ec0444fa61139969c738d13_recording.webm','recording.webm','2025-02-20 11:41:32',NULL,'G',0),(324,'G/0/e2d92491b3bf4a2c8d99dbe40c0a120d_recording.webm','recording.webm','2025-02-20 11:43:11',NULL,'G',0),(325,'G/0/673079d34d824f8a8077639ec7cb6104_recording.webm','recording.webm','2025-02-20 11:44:04',NULL,'G',0),(326,'G/0/e3bdff9704cc4767b0120c851c7537ab_recording.webm','recording.webm','2025-02-20 11:45:49',NULL,'G',0),(327,'G/0/7f1bea53f18f455a90378ba786a3ef40_recording.webm','recording.webm','2025-02-20 11:45:52',NULL,'G',0),(328,'G/0/9e00fc86eb3c4cc3b94b1af18e5e15fa_recording.webm','recording.webm','2025-02-20 11:46:39',NULL,'G',0),(329,'G/0/e8f8347067db4b62af0a4aae79178f9d_recording.webm','recording.webm','2025-02-20 11:57:28',NULL,'G',0),(330,'G/0/b326d39465614fa9bd01e0e46af35fdb_recording.webm','recording.webm','2025-02-20 11:59:18',NULL,'G',0),(331,'G/0/8ad82f27d261467081b7d5ec33cd6364_recording.webm','recording.webm','2025-02-20 12:01:53',NULL,'G',0),(332,'G/0/c48b255bf25d4b83b87d8224d1fe8213_recording.webm','recording.webm','2025-02-20 12:04:29',NULL,'G',0),(333,'G/0/bae148ca0dc942e8bc3ea4204a878e5b_recording.webm','recording.webm','2025-02-20 12:08:50',NULL,'G',0),(334,'G/0/cdcd3fe363414abda1e9af5035fa1047_recording.webm','recording.webm','2025-02-20 12:11:31',NULL,'G',0),(335,'G/0/7e8355892f1543749d4ef97e90ea2c74_recording.webm','recording.webm','2025-02-20 13:18:47',NULL,'G',0),(336,'G/0/814d1a65f804446cb16b0f80d689acd7_recording.webm','recording.webm','2025-02-20 13:21:26',NULL,'G',0),(337,'G/0/64d57fba7d304ef5820989edbfdf9500_recording.webm','recording.webm','2025-02-20 13:45:25',NULL,'G',0),(338,'G/0/b9e478cc36e049b4b09e108e7199585c_recording.webm','recording.webm','2025-02-20 13:46:33',NULL,'G',0),(339,'G/0/8402e879eef546bdb29b6ee347ae07d1_recording.webm','recording.webm','2025-02-20 13:47:36',NULL,'G',0),(340,'G/0/0c4739537fc74498ba473d4c68a3ee8b_recording.webm','recording.webm','2025-02-20 13:54:06',NULL,'G',0),(341,'G/0/0465a62031ee46baba0fc44ebda06e36_recording.webm','recording.webm','2025-02-20 13:54:12',NULL,'G',0),(342,'G/0/183133ad663149fe9a1d09c2031e0809_recording.webm','recording.webm','2025-02-20 13:54:45',NULL,'G',0),(343,'G/0/530d237761804c16992f9ed0694c92e6_recording.webm','recording.webm','2025-02-20 13:55:18',NULL,'G',0),(344,'G/0/fa91c800840347feb7ea4b320b9c4aa7_recording.webm','recording.webm','2025-02-20 13:55:34',NULL,'G',0),(345,'G/0/67bfa50f0eff4f2a931106c5a762ebfb_recording.webm','recording.webm','2025-02-20 13:55:54',NULL,'G',0),(346,'G/0/80fdd8cbad384f9eb33f0fc8fd049e67_recording.webm','recording.webm','2025-02-20 13:56:10',NULL,'G',0),(347,'G/0/485d5fd1ae8849cea9b6ee5303877acb_recording.webm','recording.webm','2025-02-20 13:58:29',NULL,'G',0),(348,'G/0/532e81e1eaa34739b830a94446ffb48e_recording.webm','recording.webm','2025-02-20 13:58:42',NULL,'G',0),(349,'G/0/aacb1f59248c4ff6bfef5a02d19e9708_recording.webm','recording.webm','2025-02-20 13:59:03',NULL,'G',0),(350,'G/0/0e73584bf2464e87b8aeafc24380ad69_recording.webm','recording.webm','2025-02-20 14:00:11',NULL,'G',0),(351,'G/0/6459be90cffd4132a9d2227e0400d2f8_recording.webm','recording.webm','2025-02-20 14:03:09',NULL,'G',0),(352,'G/0/5855902a176c4404b49cfe72dfa5db44_recording.webm','recording.webm','2025-02-20 14:04:05',NULL,'G',0),(353,'G/0/c17fe4d51fb24447818e033bee8eb0a3_recording.webm','recording.webm','2025-02-20 14:04:08',NULL,'G',0),(354,'G/0/1891b777b48146d78b4370ca4655019a_recording.webm','recording.webm','2025-02-20 14:04:56',NULL,'G',0),(355,'G/0/6fbd89ce8e3a470fbb65290dbde6a71c_recording.webm','recording.webm','2025-02-20 14:05:51',NULL,'G',0),(356,'G/0/2b410f1f2bf5457980349a45ef499c38_recording.webm','recording.webm','2025-02-20 14:08:50',NULL,'G',0),(357,'G/0/08b96a5e4b0e4bb0b611aec8399a0f85_recording.webm','recording.webm','2025-02-20 14:19:26',NULL,'G',0),(358,'G/0/26cf551ac29240de9a79780f55651189_recording.webm','recording.webm','2025-02-20 14:19:48',NULL,'G',0),(359,'G/0/67b985d08a874a71a4b69f8fa9828e75_recording.webm','recording.webm','2025-02-20 14:21:36',NULL,'G',0),(360,'G/0/64e34d8a308946c1a20276025d3a4a98_recording.webm','recording.webm','2025-02-20 14:22:22',NULL,'G',0),(361,'G/0/1a2b50b319d047289c440955240c6fbe_recording.webm','recording.webm','2025-02-20 14:25:30',NULL,'G',0),(362,'G/0/5baf4c8bd4024f5c858950081105a469_recording.webm','recording.webm','2025-02-20 14:28:10',NULL,'G',0),(363,'G/0/9503753ea83e4a5cb8a5071cf2e2d020_recording.webm','recording.webm','2025-02-20 14:31:40',NULL,'G',0),(364,'G/0/ffa3d1fe8cbd4a00b5c1bf952fc3bcfd_recording.webm','recording.webm','2025-02-20 14:31:48',NULL,'G',0),(365,'G/0/d718573fb5e8498baf6d895f44f74b14_recording.webm','recording.webm','2025-02-20 14:31:52',NULL,'G',0),(366,'G/0/a2a704c79cc8456296cd5e063f9d77ea_recording.webm','recording.webm','2025-02-20 14:32:02',NULL,'G',0),(367,'G/0/28b7db33841c4f90bec9611ff691e772_recording.webm','recording.webm','2025-02-20 14:32:07',NULL,'G',0),(368,'G/0/ec8afb6548954201b1f060aa05c686c8_recording.webm','recording.webm','2025-02-20 14:32:22',NULL,'G',0),(369,'G/0/869d728b5a5546778b361d91fca1eb72_recording.webm','recording.webm','2025-02-20 14:36:29',NULL,'G',0),(370,'G/0/808495dd27ef4c74a1fd34b5c5ace222_recording.webm','recording.webm','2025-02-20 14:43:54',NULL,'G',0),(371,'G/0/edddfb6e4f8e4a5cba2c2d9c1b96a195_recording.webm','recording.webm','2025-02-20 14:46:36',NULL,'G',0),(372,'G/0/f49eb652c19c464188137246418c0f68_recording.webm','recording.webm','2025-02-20 14:46:59',NULL,'G',0),(373,'G/0/64b1175a64004c188de450d1c84b2ffa_recording.webm','recording.webm','2025-02-20 14:47:35',NULL,'G',0),(374,'G/0/2dd97bfd821c4fecbcb64c89f003e45a_recording.webm','recording.webm','2025-02-20 14:47:55',NULL,'G',0),(375,'G/0/492b76236b484f15867ccbe395c40131_recording.webm','recording.webm','2025-02-20 14:52:06',NULL,'G',0),(376,'G/0/355ccde31f084cde82e3caf97843bbd7_recording.webm','recording.webm','2025-02-20 14:52:23',NULL,'G',0),(377,'G/0/957305e3acd64c3b96c8acd7452ade65_recording.webm','recording.webm','2025-02-20 14:52:45',NULL,'G',0),(378,'G/0/cac632eba8d543bca21d2b965b0a0c33_recording.webm','recording.webm','2025-02-20 14:53:31',NULL,'G',0),(379,'G/0/0d464f1e1ab74f1782fc3f2d1ae91d50_recording.webm','recording.webm','2025-02-20 14:54:42',NULL,'G',0),(380,'G/0/8ca959b42a3243e6a8398eaea2b7bab0_recording.webm','recording.webm','2025-02-20 14:54:53',NULL,'G',0),(381,'G/0/2f9d99a91b214ddf8a81d0cadb57271c_recording.webm','recording.webm','2025-02-20 14:55:16',NULL,'G',0),(382,'G/0/43a2453ebc0348c787bccc9254377fe2_recording.webm','recording.webm','2025-02-20 14:55:23',NULL,'G',0),(383,'G/0/7ee4b0d832af48b79bbf5fc62680144f_recording.webm','recording.webm','2025-02-20 14:56:00',NULL,'G',0),(384,'G/0/14b5aac320864dbc8f0189ce79dd0391_recording.webm','recording.webm','2025-02-20 14:56:47',NULL,'G',0),(385,'G/0/218c5ff123cc46adaf95188ee618c04d_recording.webm','recording.webm','2025-02-20 15:01:28',NULL,'G',0),(386,'G/0/812a407954224651b138b4e197a7a0c8_recording.webm','recording.webm','2025-02-20 15:03:54',NULL,'G',0),(387,'G/0/bfe0f9b499fe47e89992860b54c5dee6_recording.webm','recording.webm','2025-02-20 15:04:13',NULL,'G',0),(388,'G/0/cb01ff468c524e1aba3927fd9e032d27_recording.webm','recording.webm','2025-02-20 15:37:17',NULL,'G',0),(389,'G/0/6fbc62231992494e8df59d512444cca4_recording.webm','recording.webm','2025-02-20 15:38:40',NULL,'G',0),(390,'G/0/b3ecd921689440c88526e1ee3ad1d8fe_recording.webm','recording.webm','2025-02-20 15:38:53',NULL,'G',0),(391,'G/0/b7d513ee6a514a07a8289b25e1bdb3e8_recording.webm','recording.webm','2025-02-20 15:39:14',NULL,'G',0),(392,'G/0/bc383c1e453547eeae0c48f22d61ee44_recording.webm','recording.webm','2025-02-20 15:39:37',NULL,'G',0),(393,'G/0/95a16bf68ad54b3e8d294ea26f72b15a_recording.webm','recording.webm','2025-02-20 15:39:47',NULL,'G',0),(394,'G/0/5ead472a90a145a6ae5908169f56aa7b_recording.webm','recording.webm','2025-02-20 15:40:30',NULL,'G',0),(395,'G/0/d90846c5eb7345308ac7172957959e18_recording.webm','recording.webm','2025-02-20 15:40:36',NULL,'G',0),(396,'G/0/7ceeb5b69c494ac69f5da27584344620_recording.webm','recording.webm','2025-02-20 15:40:55',NULL,'G',0),(397,'G/0/e76811ecec2445eabb2afcb9269c6d70_recording.webm','recording.webm','2025-02-20 15:41:33',NULL,'G',0),(398,'G/0/88b7d26c1a9b44969213e8d86c462e52_recording.webm','recording.webm','2025-02-20 15:43:37',NULL,'G',0),(399,'G/0/dea7b5293605493b93a7b63109802494_recording.webm','recording.webm','2025-02-20 15:45:11',NULL,'G',0),(400,'G/0/cb1d8c522315438c8effeb9a291598d8_recording.webm','recording.webm','2025-02-20 15:45:23',NULL,'G',0),(401,'G/0/517757a030ca4685bf68905535cb8bf8_recording.webm','recording.webm','2025-02-20 15:46:03',NULL,'G',0),(402,'G/0/d2471f16ffe54dd7b4cf1c45c43bf9cd_recording.webm','recording.webm','2025-02-20 15:46:17',NULL,'G',0),(403,'G/0/e02c0eee29ca42018f91726193041bae_recording.webm','recording.webm','2025-02-20 15:46:26',NULL,'G',0),(404,'G/0/16f7c0aa617f45b59014a14fe39d9334_recording.webm','recording.webm','2025-02-20 15:46:31',NULL,'G',0),(405,'G/0/6d4db275d1d142e78886598a1c3dc2ac_recording.webm','recording.webm','2025-02-20 15:46:35',NULL,'G',0),(406,'G/0/6ced4b7cd5de4ccc9e2b267866151749_recording.webm','recording.webm','2025-02-20 15:46:40',NULL,'G',0),(407,'G/0/7ed33c52e3554b83807632d9b6a00931_recording.webm','recording.webm','2025-02-20 15:46:59',NULL,'G',0),(408,'G/0/2e55c07b8fb04a98a372408a0e07a454_recording.webm','recording.webm','2025-02-20 15:47:01',NULL,'G',0),(409,'G/0/b2c668b9504a4110b18e99941228a1aa_recording.webm','recording.webm','2025-02-20 15:47:11',NULL,'G',0),(410,'G/0/91179095094a4733b093daee7df256c1_recording.webm','recording.webm','2025-02-20 15:47:27',NULL,'G',0),(411,'G/0/b73c0526fedc490e8c2e8d1943505a75_recording.webm','recording.webm','2025-02-20 15:47:30',NULL,'G',0),(412,'G/0/896df679056e49a19df0a97f59d150d9_recording.webm','recording.webm','2025-02-20 15:47:33',NULL,'G',0),(413,'G/0/6564c2f466294a3d8e1fa4d5bac54552_recording.webm','recording.webm','2025-02-20 15:47:37',NULL,'G',0),(414,'G/0/c2fd99f06c8a49adbae50f399d64c1e9_recording.webm','recording.webm','2025-02-20 15:47:39',NULL,'G',0),(415,'G/0/4be9e21a8c6644e6842d5c234347a013_recording.webm','recording.webm','2025-02-20 15:47:43',NULL,'G',0),(416,'G/0/1512dffe2ef84159911c3329ad10850b_recording.webm','recording.webm','2025-02-20 15:48:25',NULL,'G',0),(417,'G/0/462b669e52e4488097e97c4743e2d592_recording.webm','recording.webm','2025-02-20 16:42:48',NULL,'G',0),(418,'G/0/c24ff94a699a49ed8e158e98ae8d5024_recording.webm','recording.webm','2025-02-20 17:04:35',NULL,'G',0),(419,'PCD/14/2a946e7c04234a0c9256fdaa0ac927ac_joymi.png','joymi.png','2025-02-20 17:13:06',NULL,'PCD',14),(420,'G/0/ebfb48d328474e7086a7fbbb6099e156_recording.webm','recording.webm','2025-02-20 17:15:23',NULL,'G',0),(421,'G/0/9ca5a50d854e41f585a6c0e16f3ec8be_recording.webm','recording.webm','2025-02-20 17:15:45',NULL,'G',0),(422,'G/0/aae13da180d84340a73121516d69b587_recording.webm','recording.webm','2025-02-20 17:15:59',NULL,'G',0),(423,'G/0/4a783ac9548b4eac9bed98faf722a1f8_recording.webm','recording.webm','2025-02-20 17:16:08',NULL,'G',0),(424,'G/0/e1237ae3c89e44168302b13a41587c0a_recording.webm','recording.webm','2025-02-20 17:17:18',NULL,'G',0),(425,'G/15/f7abb0947cd74fde9051d79c08cef28d_recording.webm','recording.webm','2025-02-20 17:18:10',NULL,'G',15),(426,'G/16/9b93e67492cf434b87a747dce4f2f3f3_recording.webm','recording.webm','2025-02-20 17:19:10',NULL,'G',16),(427,'G/17/a549ddc908954858a31709d5d2b3315a_recording.webm','recording.webm','2025-02-20 17:20:03',NULL,'G',17),(428,'G/18/9d803d03cdba407ea5df623512d4783c_recording.webm','recording.webm','2025-02-20 17:21:00',NULL,'G',18),(429,'G/19/a257a764036547bcb424e5c2e780b49d_recording.webm','recording.webm','2025-02-20 17:21:15',NULL,'G',19),(430,'G/20/9a8a03ddf0ed4bfdb1f810baafcbd9f3_recording.webm','recording.webm','2025-02-20 17:22:17',NULL,'G',20),(431,'G/0/631fa959dcb646cc81b218e99d560cae_recording.webm','recording.webm','2025-02-20 17:30:47',NULL,'G',0),(432,'G/0/42a1f24801bc41e8b920a15cade36df6_recording.webm','recording.webm','2025-02-20 17:30:59',NULL,'G',0),(433,'G/0/1692f7abe3884feda680fc54944bae40_recording.webm','recording.webm','2025-02-20 20:29:31',NULL,'G',0),(434,'G/0/67532b1c7a594dfbb3e3f07c8cec2e5e_recording.webm','recording.webm','2025-02-20 20:32:11',NULL,'G',0),(435,'G/0/4a779dfe4c1b4c58a7f5790c2e16661d_recording.webm','recording.webm','2025-02-20 20:44:59',NULL,'G',0),(436,'G/0/1f352654a5064ca384e2795e87111eca_recording.webm','recording.webm','2025-02-20 21:59:41',NULL,'G',0),(437,'G/0/c6077ca0bab4457283187549c867b1c0_recording.webm','recording.webm','2025-02-20 22:22:12',NULL,'G',0);
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_asset`
--

DROP TABLE IF EXISTS `game_asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_asset` (
  `game_stage_id` int NOT NULL COMMENT 'game_stage와 1:1',
  `game_scene_video` varchar(255) NOT NULL COMMENT '파일 경로',
  `opt_1` varchar(200) NOT NULL,
  `opt_2` varchar(200) NOT NULL,
  `opt_3` varchar(200) NOT NULL,
  `opt_pic_1` varchar(255) NOT NULL,
  `opt_pic_2` varchar(255) NOT NULL,
  `opt_pic_3` varchar(255) NOT NULL,
  `situation` varchar(255) NOT NULL,
  PRIMARY KEY (`game_stage_id`),
  CONSTRAINT `FK_game_stage_TO_game_asset_1` FOREIGN KEY (`game_stage_id`) REFERENCES `game_stage` (`game_stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_asset`
--

LOCK TABLES `game_asset` WRITE;
/*!40000 ALTER TABLE `game_asset` DISABLE KEYS */;
INSERT INTO `game_asset` VALUES (1,'https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_1/chapter1-1.mp4','너무 신나요!','싫어요...','무서워요.','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_1/1-1-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_1/1-1-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_1/1-1-3.png','상황: 감정이가 아침에 일어나서 어린이집 가방을 메고 있다.'),(2,'https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_2/chapter1-2.mp4','좋아요!','재미있어요!','속상해요...','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_2/1-2-3.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_2/1-2-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_2/1-2-1.png','상황: 감정이가 좋아하는 장난감을 떨어뜨렸다.'),(3,'https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_3/chapter1-3.mp4','너무 좋아요!','기다리기 싫어요.','재미있어요!','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_3/1-3-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_3/1-3-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_3/1-3-3.png','상황: 신호등 앞에서 오래 기다리고 있다'),(4,'https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_4/chapter1-4.mp4','무서워요!','안녕하세요!','신나요!','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_4/1-4-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_4/1-4-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_4/1-4-3.png','상황: 큰 강아지가 짖으며 다가온다'),(5,'https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_5/chapter1-5.mp4','대단해요!','싫어요...','무서워요...','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_5/1-5-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_5/1-5-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_1/stage_5/1-5-3.png','상황: 길가에서 무지개를 발견했다'),(6,'https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_1/chapter2-1.mp4','정말 싫어요!','최고의 선물이에요 감사해요!','동물원에서 뛰어놀고 싶어요!','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_1/2-1-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_1/2-1-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_1/2-1-3.png','상황: 감정이의 생일을 맞아 아빠와 감정이는 동물원에 방문했다. '),(7,'https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_2/chapter2-2.mp4','수의사 선생님 고마워요','빨리 나았으면 좋겠어요','기린 보고 싶어요!','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_2/2-2-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_2/2-2-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_2/2-2-3.png','상황: 동물원에서 다친 코끼리를 발견했다'),(8,'https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_3/chapter2-3.mp4','화장실 가고싶어요!','저리 비켜!','저도 하고 싶었는데...','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_3/2-3-3.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_3/2-3-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_3/2-3-1.png','상황: 감정이는 다른 친구가 아기 팬더와 가까이서 사진을 찍는 모습을 보았다. 하지만 관람객이 많아서 감정이는 찍지 못하였다.'),(9,'https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_4/chapter2-4.mp4','여기서 나가고 싶어요','저 뱀과 친구할래요','뱀을 만져볼래요','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_4/2-4-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_4/2-4-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_4/2-4-3.png','상황: 파충류관에서 큰 뱀을 마주쳤다'),(10,'https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_5/chapter2-5.mp4','사자도 피자 먹어요?','사자가 고기를 먹는 모습을 처음 봐요!','뱀보러 갈래요','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_5/2-5-2.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_5/2-5-1.png','https://cdn.hi-five.site/assets/game_assets/chapter_2/stage_5/2-5-3.png','상황 : 감정이는 사자가 고기를 뜯어먹는 모습을 보았다.');
/*!40000 ALTER TABLE `game_asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_chapter`
--

DROP TABLE IF EXISTS `game_chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_chapter` (
  `game_chapter_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `chapter_pic` varchar(100) NOT NULL,
  PRIMARY KEY (`game_chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_chapter`
--

LOCK TABLES `game_chapter` WRITE;
/*!40000 ALTER TABLE `game_chapter` DISABLE KEYS */;
INSERT INTO `game_chapter` VALUES (1,'학교 가는 길','https://cdn.hi-five.site/assets/game_assets/chapter_1/chapter1Scene.png'),(2,'동물원 여행','https://cdn.hi-five.site/assets/game_assets/chapter_2/chapter2Scene.png');
/*!40000 ALTER TABLE `game_chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_log`
--

DROP TABLE IF EXISTS `game_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_log` (
  `game_log_id` int NOT NULL AUTO_INCREMENT,
  `selected_opt` int NOT NULL,
  `corrected` tinyint(1) NOT NULL,
  `submit_dttm` datetime NOT NULL,
  `consulted` tinyint(1) NOT NULL,
  `child_game_stage_id` int NOT NULL,
  `child_user_id` int NOT NULL,
  `game_stage_id` int NOT NULL,
  PRIMARY KEY (`game_log_id`),
  KEY `FK_child_user_TO_game_log_idx` (`child_user_id`),
  KEY `FK_child_game_stage_TO_game_log` (`child_game_stage_id`),
  KEY `FK_game_satge_TO_game_log_idx` (`game_stage_id`),
  CONSTRAINT `FK_child_game_stage_TO_game_log` FOREIGN KEY (`child_game_stage_id`) REFERENCES `child_game_stage` (`child_game_stage_id`),
  CONSTRAINT `FK_child_user_TO_game_log` FOREIGN KEY (`child_user_id`) REFERENCES `child_user` (`child_user_id`),
  CONSTRAINT `FK_game_satge_TO_game_log` FOREIGN KEY (`game_stage_id`) REFERENCES `game_stage` (`game_stage_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_log`
--

LOCK TABLES `game_log` WRITE;
/*!40000 ALTER TABLE `game_log` DISABLE KEYS */;
INSERT INTO `game_log` VALUES (1,1,1,'2025-02-08 11:58:21',1,2,2,2),(4,2,1,'2025-02-19 17:33:49',1,100,2,1),(5,2,1,'2025-02-19 17:35:25',1,100,2,1),(6,2,0,'2025-02-19 17:36:24',1,101,2,2),(7,2,0,'2025-02-19 17:36:38',1,101,2,2),(8,2,0,'2025-02-19 17:37:40',1,102,2,5),(9,2,0,'2025-02-19 17:37:54',1,102,2,5),(10,2,1,'2025-02-20 00:45:21',1,103,2,1),(11,2,1,'2025-02-20 00:47:00',1,104,2,1),(12,2,1,'2025-02-20 00:49:20',1,105,2,1),(13,2,1,'2025-02-20 00:50:57',1,106,2,1),(14,2,1,'2025-02-20 00:55:53',1,107,2,1),(15,1,1,'2025-02-20 17:18:10',1,111,9,1),(16,3,1,'2025-02-20 17:19:10',1,112,9,2),(17,2,1,'2025-02-20 17:20:02',1,113,9,3),(18,1,0,'2025-02-20 17:21:00',1,114,9,4),(19,1,0,'2025-02-20 17:21:15',1,114,9,4),(20,1,1,'2025-02-20 17:22:17',1,115,9,5);
/*!40000 ALTER TABLE `game_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_meeting_schdl`
--

DROP TABLE IF EXISTS `game_meeting_schdl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_meeting_schdl` (
  `meeting_schdl_id` int NOT NULL AUTO_INCREMENT,
  `schdl_dttm` datetime NOT NULL,
  `create_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_dttm` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `start_dttm` datetime NOT NULL,
  `status` enum('P','A','E') NOT NULL DEFAULT 'P' COMMENT 'pending, active, end',
  `host_id` int NOT NULL COMMENT '상담사 유저',
  `child_user_id` int NOT NULL,
  `session_id` varchar(255) DEFAULT NULL COMMENT 'OpenVidu 세션 ID',
  PRIMARY KEY (`meeting_schdl_id`),
  UNIQUE KEY `session_id` (`session_id`),
  KEY `FK_consultant_user_TO_game_meeting_schdl_1` (`host_id`),
  KEY `FK_child_user_TO_game_meeting_schdl_1` (`child_user_id`),
  CONSTRAINT `FK_child_user_TO_game_meeting_schdl_1` FOREIGN KEY (`child_user_id`) REFERENCES `child_user` (`child_user_id`),
  CONSTRAINT `FK_consultant_user_TO_game_meeting_schdl_1` FOREIGN KEY (`host_id`) REFERENCES `consultant_user` (`consultant_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_meeting_schdl`
--

LOCK TABLES `game_meeting_schdl` WRITE;
/*!40000 ALTER TABLE `game_meeting_schdl` DISABLE KEYS */;
INSERT INTO `game_meeting_schdl` VALUES (1,'2025-02-20 03:00:00','2025-02-20 03:07:53','2025-02-20 12:01:49',NULL,'2025-02-20 02:50:00','E',3,10,'fd88bef5-51df-43d9-8229-b4077b34fc2d'),(2,'2025-02-20 08:00:00','2025-02-20 08:29:19','2025-02-20 12:01:49',NULL,'2025-02-20 07:50:50','E',3,10,'27b47641-a18f-47eb-a56c-39a175134154'),(3,'2025-02-20 08:00:00','2025-02-20 08:37:30','2025-02-20 12:01:49',NULL,'2025-02-20 07:50:50','E',4,11,'3d53c899-1c52-4a49-8fce-dacabdddba7b'),(4,'2025-02-20 09:00:00','2025-02-20 09:01:01','2025-02-20 12:01:49',NULL,'2025-02-20 08:50:00','E',3,10,'b04d95a6-9de3-4cef-9d71-7e501879c035'),(5,'2025-02-20 09:00:00','2025-02-20 09:27:07','2025-02-20 12:01:49',NULL,'2025-02-20 08:50:00','E',0,2,'fce1f156-11ca-47d1-a79f-0a3388ef9b61'),(6,'2025-02-20 09:00:00','2025-02-20 09:27:11','2025-02-20 12:01:49','2025-02-20 09:28:54','2025-02-20 08:50:00','E',4,11,'a96349d7-48c3-416c-becb-7887c74957f9'),(7,'2025-02-20 09:00:00','2025-02-20 09:29:09','2025-02-20 12:01:49','2025-02-20 09:30:29','2025-02-20 08:50:00','E',4,11,NULL),(8,'2025-02-20 09:00:00','2025-02-20 09:30:43','2025-02-20 12:01:49',NULL,'2025-02-20 08:50:00','E',4,11,NULL),(9,'2025-02-20 10:00:00','2025-02-20 10:21:21','2025-02-20 12:01:49',NULL,'2025-02-20 09:50:00','E',4,11,NULL),(10,'2025-02-19 16:00:00','2025-02-20 10:32:54','2025-02-20 12:01:49',NULL,'2025-02-20 09:50:00','E',0,2,NULL),(11,'2025-02-20 12:00:00','2025-02-20 10:33:07','2025-02-20 11:07:38','2025-02-20 11:07:38','2025-02-20 10:50:00','P',0,2,NULL),(12,'2025-02-25 15:00:00','2025-02-20 10:44:05','2025-02-20 10:44:05',NULL,'2025-02-25 14:50:00','P',0,10,NULL),(14,'2025-02-20 11:00:00','2025-02-20 11:27:23','2025-02-20 12:01:49','2025-02-20 11:52:04','2025-02-20 10:50:00','E',3,10,NULL),(15,'2025-02-20 11:00:00','2025-02-20 11:57:25','2025-02-20 12:01:49',NULL,'2025-02-20 10:50:00','E',3,10,'730da925-71da-47d6-9e92-73160b18857f'),(16,'2025-02-20 12:00:00','2025-02-20 12:01:31','2025-02-20 12:01:53',NULL,'2025-02-20 11:50:00','A',4,11,'7c31cc20-5651-439d-a1de-7f5fe25c3c4a'),(17,'2025-02-20 12:00:00','2025-02-20 12:04:22','2025-02-20 12:11:31',NULL,'2025-02-20 11:50:00','A',3,10,'35a9ef8f-166a-4f43-ba3f-0048b09e832d'),(18,'2025-02-20 13:00:00','2025-02-20 13:19:45','2025-02-20 13:21:25',NULL,'2025-02-20 12:50:00','A',4,11,'2be0eea2-53a4-4549-b232-7b7effdb4857'),(19,'2025-02-20 13:00:00','2025-02-20 13:45:20','2025-02-20 14:21:02',NULL,'2025-02-20 12:50:00','A',3,10,NULL),(20,'2025-02-20 14:00:00','2025-02-20 13:53:37','2025-02-20 14:03:09',NULL,'2025-02-20 13:50:00','A',0,2,'2ec13097-4dc2-4a77-ad6f-18cb89e60ee3'),(21,'2025-02-20 14:00:00','2025-02-20 14:19:20','2025-02-20 14:56:47',NULL,'2025-02-20 13:50:00','A',4,11,'e50e56c9-e87b-4323-95b9-54a0dc3d1c65'),(22,'2025-02-20 15:00:00','2025-02-20 15:01:23','2025-02-20 15:04:13',NULL,'2025-02-20 14:50:00','A',3,10,'92dbd026-37ad-4650-8af9-b2a820225d7b'),(23,'2025-02-20 15:00:00','2025-02-20 15:35:50','2025-02-20 15:48:23',NULL,'2025-02-20 14:50:00','A',4,11,'928925b7-01e7-40f0-81ba-0eccf2e5ea83'),(24,'2025-02-20 16:00:00','2025-02-20 15:59:01','2025-02-20 16:18:55',NULL,'2025-02-20 15:50:00','A',4,11,'cbde13c5-dd11-41b6-a565-323cee556278'),(25,'2025-02-20 17:00:00','2025-02-20 17:04:22','2025-02-20 17:12:17','2025-02-20 17:12:17','2025-02-20 16:50:00','A',0,9,NULL),(26,'2025-02-20 17:00:00','2025-02-20 17:13:30','2025-02-20 17:17:00','2025-02-20 17:17:00','2025-02-20 16:50:00','A',0,14,NULL),(27,'2025-02-20 17:00:00','2025-02-20 17:17:12','2025-02-20 17:24:48','2025-02-20 17:24:48','2025-02-20 16:50:00','A',0,9,'92f3c4ca-68de-4bd5-8a00-91d391013da8'),(28,'2025-02-21 09:00:00','2025-02-20 20:31:12','2025-02-20 20:38:49','2025-02-20 20:38:49','2025-02-21 08:50:00','P',0,2,NULL),(29,'2025-02-20 21:00:00','2025-02-20 21:53:15','2025-02-20 21:53:21',NULL,'2025-02-20 20:50:00','A',0,2,'33432fa1-2c51-40d5-96a7-2b686265ffd4'),(30,'2025-02-21 10:00:00','2025-02-20 21:54:08','2025-02-20 21:54:08',NULL,'2025-02-21 09:50:00','P',0,2,NULL),(31,'2025-02-20 22:00:00','2025-02-20 22:06:17','2025-02-20 22:06:24',NULL,'2025-02-20 21:50:00','A',0,2,'7ab0a9c7-f296-4aea-a14c-34cd888eb8a6');
/*!40000 ALTER TABLE `game_meeting_schdl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_stage`
--

DROP TABLE IF EXISTS `game_stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_stage` (
  `game_stage_id` int NOT NULL AUTO_INCREMENT,
  `stage` int NOT NULL,
  `crt_ans` int NOT NULL,
  `game_chapter_id` int NOT NULL,
  `emotion_id` int NOT NULL,
  PRIMARY KEY (`game_stage_id`),
  KEY `FK_emotion_TO_game_stage_idx` (`emotion_id`),
  KEY `FK_game_chapter_TO_game_stage` (`game_chapter_id`),
  CONSTRAINT `FK_emotion_TO_game_stage` FOREIGN KEY (`emotion_id`) REFERENCES `emotion` (`emotion_id`),
  CONSTRAINT `FK_game_chapter_TO_game_stage` FOREIGN KEY (`game_chapter_id`) REFERENCES `game_chapter` (`game_chapter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_stage`
--

LOCK TABLES `game_stage` WRITE;
/*!40000 ALTER TABLE `game_stage` DISABLE KEYS */;
INSERT INTO `game_stage` VALUES (1,1,1,1,1),(2,2,3,1,2),(3,3,2,1,3),(4,4,1,1,4),(5,5,1,1,5),(6,1,2,2,1),(7,2,2,1,2),(8,3,3,1,3),(9,4,1,1,4),(10,5,2,1,5);
/*!40000 ALTER TABLE `game_stage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice` (
  `notice_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `view_cnt` int NOT NULL DEFAULT '0',
  `content` text NOT NULL,
  `create_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `consultant_user_id` int NOT NULL,
  PRIMARY KEY (`notice_id`),
  KEY `FK_consultant_user_TO_notice_1` (`consultant_user_id`),
  CONSTRAINT `FK_consultant_user_TO_notice_1` FOREIGN KEY (`consultant_user_id`) REFERENCES `consultant_user` (`consultant_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
INSERT INTO `notice` VALUES (1,'상담센터 휴무 안내',5,'<p>안녕하세요, 하이파이브 센터입니다.</p><p>항상 저희 상담센터를 이용해 주셔서 감사합니다.</p><p><br></p><p>오는 **2025년 2월 21일(금)**은 삼일절 공휴일로 상담센터가 <strong>휴무</strong>임을 안내드립니다.</p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>휴무일</strong>: 2021년 2월 21일(금)</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>정상 운영</strong>: 2025년 2월 24일(월)부터 정상 운영됩니다.</li></ol><p><br></p><p>휴무일에는 전화 상담 및 예약 변경이 어려우니 양해 부탁드립니다.</p><p>감사합니다.</p>','2025-02-18 15:07:22','2025-02-20 10:18:07',NULL,3),(2,'상담 예약 시스템 점검 안내',2,'<p>안녕하세요, 하이파이브 센터입니다.</p><p>더 나은 서비스를 제공하기 위해 상담 예약 시스템 점검이 진행됩니다.</p><p><br></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>점검 일시</strong>: 2025년 2월 20일(화) 00:00 ~ 06:00</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>점검 내용</strong>: 시스템 안정화 및 기능 개선</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>영향 범위</strong>: 점검 시간 동안 상담 예약 및 변경이 불가합니다.</li></ol><p><br></p><p>불편을 최소화할 수 있도록 최선을 다하겠습니다.</p><p>감사합니다.</p>','2025-02-18 15:08:04','2025-02-20 10:18:12',NULL,3),(3,'상담 후기 이벤트 안내',1,'<p>안녕하세요, 하이파이브 센터입니다.</p><p>상담 후기를 남겨주신 분들께 감사의 마음을 전하고자 <strong>이벤트</strong>를 준비했습니다!</p><p><br></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>이벤트 기간</strong>: 2025년 2월 1일 ~ 3월 31일</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>참여 방법</strong>: 상담 후 홈페이지 \'후기 게시판\'에 솔직한 상담 후기를 작성해주세요.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>경품</strong>: 추첨을 통해 10분께 스타벅스 기프티콘을 드립니다!</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>당첨자 발표</strong>: 2025년 4월 5일(홈페이지 공지 및 개별 연락)</li></ol><p><br></p><p>여러분의 소중한 의견이 더 나은 상담 서비스를 만듭니다.</p><p>많은 참여 부탁드립니다!</p>','2025-02-18 15:10:12','2025-02-18 15:13:07',NULL,3),(4,'화상 상담 가이드 안내',1,'<p>안녕하세요, 하이파이브 센터입니다.</p><p>비대면 화상 상담을 준비하시는 분들을 위해 안내드립니다.</p><p><br></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>준비물</strong>: 카메라와 마이크가 있는 PC, 태블릿 또는 스마트폰</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>접속 방법</strong>: 예약 후 발송된 <strong>화상 상담 링크</strong>를 통해 접속</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>권장 환경</strong>: 조용하고 안정적인 인터넷 환경에서 진행해주세요.</li></ol><p><br></p><p>상담 시작 10분 전에 접속하여 카메라와 마이크 상태를 확인해 주세요.</p><p>기술적 문제가 있으신 경우 고객센터로 문의 바랍니다.</p>','2025-02-18 15:14:45','2025-02-20 14:02:33',NULL,3),(5,'센터 방문 시 유의사항',2,'<p>안녕하세요, 하이파이브 센터입니다.</p><p>센터 방문 시 참고해 주세요!</p><p><br></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>신분증</strong>을 지참해 주세요.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>예약 시간 10분 전까지 도착해 주세요.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>상담 중에는 <strong>휴대폰 사용을 자제</strong>해 주세요.</li></ol><p><br></p><p>원활한 상담 진행을 위해 협조 부탁드립니다.</p>','2025-02-18 15:19:11','2025-02-20 11:10:58',NULL,3),(6,'상담 만족도 조사 안내',4,'<p>안녕하세요, 하이파이브 센터입니다.</p><p>2025년 3월 1일부터 <strong>상담 만족도 조사</strong>를 진행합니다.</p><p><br></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>참여 방법</strong>: 상담 후 발송되는 <strong>문자 메시지 링크</strong>를 통해 참여</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>소요 시간</strong>: 약 2~3분</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>참여 혜택</strong>: 추첨을 통해 5분께 모바일 상품권 증정</li></ol><p><br></p>','2025-02-18 15:24:40','2025-02-20 14:02:45',NULL,3),(7,'설 연휴 운영 안내',12,'<p>안녕하세요</p><p>하이파이브 센터입니다.</p><p><br></p><p>설 명절 당일(2월 10일)을 제외한 연휴 기간 동안 정상 운영합니다. </p><p>문의나 이용에 참고해주시기 바랍니다.</p><p><br></p><p>즐거운 설 연휴 보내세요! 😊</p>','2025-02-18 15:53:07','2025-02-20 15:21:46',NULL,3),(8,'2월 28일 휴관 안내',37,'<p>안녕하세요, </p><p>하이파이브 센터입니다.</p><p><br></p><p>2일(28)은 센터 내부 시설 점검으로 인해 하루 휴관합니다.</p><p>이용자분들의 너른 양해 부탁드리며, 문의는 ○○○-○○○○로 연락 주시기 바랍니다.</p><p>항상 아동과 가족을 위해 최선을 다하겠습니다. </p><p><br></p><p>감사합니다.</p>','2025-02-18 15:54:35','2025-02-20 15:44:33',NULL,3),(9,'공지사항 테스트용',3,'<p><img src=\"https://cdn.hi-five.site/uploads/NE/9/97c15c03fd07476584432f3d07be45e2_editor_image_0.png\"></p><p>공지사항 테스트용</p><p>공지사항 테스트용</p>','2025-02-20 01:35:42','2025-02-20 10:49:08','2025-02-20 01:35:51',0),(10,'123',2,'<p>123</p>','2025-02-20 02:07:15','2025-02-20 10:49:11','2025-02-20 02:07:18',0),(11,'제목',20,'<p>내용</p><p>줄바꿈</p><p>줄바꿈</p><div class=\"ql-code-block-container\" spellcheck=\"false\"><div class=\"ql-code-block\">주울바꿈</div></div><p><img src=\"https://cdn.hi-five.site/uploads/NE/11/d75852da21d64974bd0b604d1f90341e_editor_image_0.png\"></p>','2025-02-20 10:46:37','2025-02-20 15:47:03','2025-02-20 10:47:59',0);
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_user`
--

DROP TABLE IF EXISTS `parent_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_user` (
  `parent_user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `pwd` varchar(75) NOT NULL,
  `phone` char(13) NOT NULL,
  `create_dttm` datetime DEFAULT CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `update_dttm` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `consultant_user_id` int NOT NULL,
  `temp_pwd` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`parent_user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `FK_consultant_user_TO_parent_user_1` (`consultant_user_id`),
  CONSTRAINT `FK_consultant_user_TO_parent_user_1` FOREIGN KEY (`consultant_user_id`) REFERENCES `consultant_user` (`consultant_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_user`
--

LOCK TABLES `parent_user` WRITE;
/*!40000 ALTER TABLE `parent_user` DISABLE KEYS */;
INSERT INTO `parent_user` VALUES (1,'김의현','keh0885@gmail.com','$2a$10$IjUpfH5PhrFfkCTQ9hnhhe3cs7A/uStU77cm5ldWeUtQJn4/xc7JW','01012341234','2025-01-25 18:04:17',NULL,'2025-02-18 16:50:30',0,0),(4,'박성원','chanhoan01@naver.com','$2a$10$HGGVFUY37PgmlJuhNDzxTOlTTU1mDyn0HJRz8.tgIvpo6wbeNfpfe','01010101010','2025-01-25 21:10:10',NULL,'2025-02-19 09:34:11',0,0),(6,'김서린','chzh35@naver.com','$2a$10$fRBKorMUUkdr0VnHdzn6IuZ0sfVsDD3VJYN2TPCQT2HQdrvwn/wYm','01040562354',NULL,NULL,'2025-02-01 21:06:41',0,1),(7,'안녕하세요','chanhoan01@daum.net','$2a$10$.f9NTHB7jAPjSkO5rlors.B.OVNPEJlaM2SDTJICnx6VhDxG8viWO','01040404040',NULL,NULL,'2025-02-02 01:39:42',0,1),(8,'김서린','mkos47635@naver.com','$2a$10$JxvXmSiTSyJNczxKPn200es/qYGjilc2z6ymPlFfwLzYs.GZziL2y','01012345678',NULL,'2025-02-17 01:19:10','2025-02-17 01:19:10',0,1),(10,'김서린','seorin66@naver.com','$2a$10$vDiIno2sQ36WdGwafSWVFu9q.wpFHTmOCVZRaEtil7iCPNpJg4MSa','01012341234','2025-02-17 02:18:48',NULL,'2025-02-17 11:31:19',3,0),(11,'이종범','jongbeom54@naver.com','$2a$10$THkJikJGJggxYrsD3zGlX.gBl0uwv2edHnw5ATiJ0ko/bmOk6oY.y','01034010923',NULL,NULL,'2025-02-19 10:18:46',0,1),(12,'이종','sky5680s@naver.com','$2a$10$GuoQmOmvCEFVFOUSBEHQa.Ukn1iYHMJgE9115aZihfPMgyaKgh91e','01034010923',NULL,'2025-02-19 10:26:03','2025-02-19 10:26:03',0,0),(13,'정싸피','seungmingpt@gmail.com','$2a$10$sVJ6Quk6BMVdbkCPlgR2jOJ6YGYroXZlUvhma/6G/VJq8Z6x4SCwi','01011111111',NULL,NULL,'2025-02-20 17:14:50',0,0);
/*!40000 ALTER TABLE `parent_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qna`
--

DROP TABLE IF EXISTS `qna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qna` (
  `qna_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `create_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `parent_user_id` int NOT NULL COMMENT '질문작성자',
  PRIMARY KEY (`qna_id`),
  KEY `FK_parent_user_TO_qna_1` (`parent_user_id`),
  CONSTRAINT `FK_parent_user_TO_qna_1` FOREIGN KEY (`parent_user_id`) REFERENCES `parent_user` (`parent_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qna`
--

LOCK TABLES `qna` WRITE;
/*!40000 ALTER TABLE `qna` DISABLE KEYS */;
INSERT INTO `qna` VALUES (29,'qna 테스트용','<p>qna 테스트용</p><p><img src=\"__EDITOR_IMAGE_PLACEHOLDER_0__\"></p>','2025-02-20 01:36:14','2025-02-20 01:57:38','2025-02-20 01:57:38',4),(30,'qna 테스트용','<p>qna 테스트용</p><p><img src=\"__EDITOR_IMAGE_PLACEHOLDER_0__\"></p>','2025-02-20 01:37:42','2025-02-20 01:57:27','2025-02-20 01:57:27',4),(31,'123','<p>123</p>','2025-02-20 01:40:08','2025-02-20 01:57:24','2025-02-20 01:57:24',4),(32,'123','<p>123</p>','2025-02-20 01:48:04','2025-02-20 01:57:20','2025-02-20 01:57:20',4),(33,'123','<p>123</p><p><img src=\"https://cdn.hi-five.site/uploads/QE/33/ff311bf4ad71446ab8d54a27ccd474a6_editor_image_0.png\"></p><p><img src=\"__EDITOR_IMAGE_PLACEHOLDER_1__\"></p>','2025-02-20 01:57:45','2025-02-20 01:57:56','2025-02-20 01:57:56',4),(34,'테스트용','<p>테스트용</p>','2025-02-20 02:03:35','2025-02-20 02:06:00','2025-02-20 02:06:00',4),(35,'우리 아이가 잠을 안자요..','<p>아이가 밤에 잠을 안잡니다. </p><p><br></p><p>게임에 빠셔서 늦게까지 게임만 해요 ㅠㅠ</p><p><br></p><p>우리 승우 어떻게 하면 좋을까요 선생님</p><p><br></p><p>교육을 어떤 방식으로 해줘야 할 지 모르겠습니다.</p>','2025-02-20 11:08:29','2025-02-20 11:08:29',NULL,4),(36,'상담 요청은 어디서 할 수 있나요?','<p>상담 요청을 따로 하는 곳이 없을까요?</p><p><br></p><p>그냥 질문게시판에 올리면 될까요?</p>','2025-02-20 11:09:25','2025-02-20 11:09:25',NULL,4);
/*!40000 ALTER TABLE `qna` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qna_answer`
--

DROP TABLE IF EXISTS `qna_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qna_answer` (
  `qna_ans_id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `create_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_dttm` datetime DEFAULT NULL,
  `board_id` int NOT NULL,
  `consultant_user_id` int NOT NULL,
  PRIMARY KEY (`qna_ans_id`),
  KEY `FK_qna_TO_qna_answer_1` (`board_id`),
  KEY `FK_consultant_user_TO_qna_answer_1` (`consultant_user_id`),
  CONSTRAINT `FK_consultant_user_TO_qna_answer_1` FOREIGN KEY (`consultant_user_id`) REFERENCES `consultant_user` (`consultant_user_id`),
  CONSTRAINT `FK_qna_TO_qna_answer_1` FOREIGN KEY (`board_id`) REFERENCES `qna` (`qna_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qna_answer`
--

LOCK TABLES `qna_answer` WRITE;
/*!40000 ALTER TABLE `qna_answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `qna_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statistic`
--

DROP TABLE IF EXISTS `statistic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statistic` (
  `statistic_id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `trial_cnt` int NOT NULL,
  `crt_cnt` int NOT NULL,
  `stage_crt_rate_1` decimal(3,1) NOT NULL,
  `stage_crt_rate_2` decimal(3,1) NOT NULL,
  `stage_crt_rate_3` decimal(3,1) NOT NULL,
  `stage_crt_rate_4` decimal(3,1) NOT NULL,
  `stage_crt_rate_5` decimal(3,1) NOT NULL,
  `emotion_id` int NOT NULL,
  `child_user_id` int NOT NULL,
  `stage_try_cnt_1` int NOT NULL,
  `stage_try_cnt_2` int NOT NULL,
  `stage_try_cnt_3` int NOT NULL,
  `stage_try_cnt_4` int NOT NULL,
  `stage_try_cnt_5` int NOT NULL,
  `stage_crt_cnt_1` int NOT NULL,
  `stage_crt_cnt_2` int NOT NULL,
  `stage_crt_cnt_3` int NOT NULL,
  `stage_crt_cnt_4` int NOT NULL,
  `stage_crt_cnt_5` int NOT NULL,
  PRIMARY KEY (`statistic_id`),
  KEY `FK_emotion_TO_statistic_1` (`emotion_id`),
  KEY `FK_child_user_TO_statistic_1` (`child_user_id`),
  CONSTRAINT `FK_child_user_TO_statistic_1` FOREIGN KEY (`child_user_id`) REFERENCES `child_user` (`child_user_id`),
  CONSTRAINT `FK_emotion_TO_statistic_1` FOREIGN KEY (`emotion_id`) REFERENCES `emotion` (`emotion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statistic`
--

LOCK TABLES `statistic` WRITE;
/*!40000 ALTER TABLE `statistic` DISABLE KEYS */;
INSERT INTO `statistic` VALUES (1,2,10,2,10.0,2.0,10.0,2.0,10.0,1,2,2,10,2,10,2,10,2,10,2,10),(2,304,10,4,8.0,40.0,8.0,4.0,8.0,2,2,4,10,4,8,4,8,4,8,4,8),(3,6,6,6,6.0,6.0,6.0,6.0,6.0,3,2,6,6,6,6,8,6,6,6,6,6),(4,8,4,8,4.0,8.0,4.0,8.0,4.0,4,2,8,4,8,4,8,4,8,4,8,4),(5,10,2,10,2.0,10.0,2.0,10.0,2.0,5,2,10,2,10,2,10,2,10,2,10,2);
/*!40000 ALTER TABLE `statistic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_text_log`
--

DROP TABLE IF EXISTS `study_text_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_text_log` (
  `study_text_log_id` int NOT NULL AUTO_INCREMENT,
  `t_happy` decimal(4,1) NOT NULL,
  `t_anger` decimal(4,1) NOT NULL,
  `t_sad` decimal(4,1) NOT NULL,
  `t_panic` decimal(4,1) NOT NULL,
  `t_fear` decimal(4,1) NOT NULL,
  `stt` text NOT NULL,
  `start_dttm` datetime NOT NULL,
  `end_dttm` datetime DEFAULT NULL,
  `text_similarity` decimal(4,1) NOT NULL,
  `child_study_stage_id` int NOT NULL,
  PRIMARY KEY (`study_text_log_id`),
  KEY `FK_child_study_stage_TO_study_text_log_idx` (`child_study_stage_id`),
  CONSTRAINT `FK_child_study_stage_TO_study_text_log` FOREIGN KEY (`child_study_stage_id`) REFERENCES `child_study_stage` (`child_study_stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_text_log`
--

LOCK TABLES `study_text_log` WRITE;
/*!40000 ALTER TABLE `study_text_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_text_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_video_log`
--

DROP TABLE IF EXISTS `study_video_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_video_log` (
  `study_log_id` int NOT NULL AUTO_INCREMENT,
  `f_happy` decimal(4,1) NOT NULL,
  `f_anger` decimal(4,1) NOT NULL,
  `f_sad` decimal(4,1) NOT NULL,
  `f_panic` decimal(4,1) NOT NULL,
  `f_fear` decimal(4,1) NOT NULL,
  `start_dttm` datetime NOT NULL,
  `end_dttm` datetime DEFAULT NULL,
  `child_study_stage_id` int NOT NULL,
  PRIMARY KEY (`study_log_id`),
  KEY `FK_child_study_stage_TO_study_log_1` (`child_study_stage_id`),
  CONSTRAINT `FK_child_study_stage_TO_study_log_1` FOREIGN KEY (`child_study_stage_id`) REFERENCES `child_study_stage` (`child_study_stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_video_log`
--

LOCK TABLES `study_video_log` WRITE;
/*!40000 ALTER TABLE `study_video_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_video_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-20 22:23:39
