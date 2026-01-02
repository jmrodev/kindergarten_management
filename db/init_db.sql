/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: kindergarten_db
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_level`
--

DROP TABLE IF EXISTS `access_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_level`
--

LOCK TABLES `access_level` WRITE;
/*!40000 ALTER TABLE `access_level` DISABLE KEYS */;
INSERT INTO `access_level` VALUES
(1,'Full Access','Grants full administrative privileges across the system.'),
(2,'Director Access','Grants administrative privileges for managing staff, classrooms, and overall school operations.'),
(3,'Teacher Access','Grants privileges for managing assigned students, attendance, and classroom activities.'),
(4,'Secretary Access','Grants privileges for managing student enrollments, guardian information, and general administrative tasks.'),
(5,'Guardian Access','Grants privileges for parents/guardians to view and manage their children\'s information.'),
(6,'Admin','Full Access'),
(7,'Admin','Full Access');
/*!40000 ALTER TABLE `access_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text DEFAULT NULL,
  `description_optional` text DEFAULT NULL,
  `schedule_optional` text DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `classroom_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `street` text DEFAULT NULL,
  `number` text DEFAULT NULL,
  `city` text DEFAULT NULL,
  `provincia` text DEFAULT NULL,
  `postal_code_optional` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES
(1,'Admin Street','123','Admin City','Admin Province','12345');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` text DEFAULT NULL,
  `leave_type_optional` text DEFAULT NULL,
  `classroom_id` int(11) DEFAULT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `check_in_adult` varchar(255) DEFAULT NULL,
  `check_out_adult` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `staff_id` (`staff_id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_types`
--

DROP TABLE IF EXISTS `blood_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(10) NOT NULL COMMENT 'Tipo de sangre (ej: A+, O-, etc.)',
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_types`
--

LOCK TABLES `blood_types` WRITE;
/*!40000 ALTER TABLE `blood_types` DISABLE KEYS */;
INSERT INTO `blood_types` VALUES
(1,'A+','Tipo A positivo'),
(2,'A-','Tipo A negativo'),
(3,'B+','Tipo B positivo'),
(4,'B-','Tipo B negativo'),
(5,'AB+','Tipo AB positivo'),
(6,'AB-','Tipo AB negativo'),
(7,'O+','Tipo O positivo'),
(8,'O-','Tipo O negativo');
/*!40000 ALTER TABLE `blood_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar`
--

DROP TABLE IF EXISTS `calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `event_type` enum('inscripcion','inicio_clases','fin_clases','vacaciones','invierno','feriado','personal_activo','dia_maestro','arte','musica','gimnasia','ingles','expresion_corporal','salida','reunion_directivos_familia','reunion_apoyo_familia','reunion_personal','celebracion','evento_especial') DEFAULT NULL,
  `classroom_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`),
  CONSTRAINT `calendar_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar`
--

LOCK TABLES `calendar` WRITE;
/*!40000 ALTER TABLE `calendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `shift` enum('Mañana','Tarde','Completo') DEFAULT NULL,
  `academic_year` int(11) DEFAULT NULL,
  `age_group` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `classroom_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
INSERT INTO `classroom` VALUES
(1,'Sala Azul',NULL,NULL,NULL,NULL,NULL,NULL),
(2,'Sala Roja',NULL,NULL,NULL,NULL,NULL,NULL),
(3,'Sala Verde',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_id` int(11) DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `conversation_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/*!40000 ALTER TABLE `conversation` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation_guardian`
--

DROP TABLE IF EXISTS `conversation_guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation_guardian` (
  `conversation_id` int(11) NOT NULL,
  `guardian_id` int(11) NOT NULL,
  PRIMARY KEY (`conversation_id`,`guardian_id`),
  KEY `guardian_id` (`guardian_id`),
  CONSTRAINT `conversation_guardian_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `conversation_guardian_ibfk_2` FOREIGN KEY (`guardian_id`) REFERENCES `guardian` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation_guardian`
--

LOCK TABLES `conversation_guardian` WRITE;
/*!40000 ALTER TABLE `conversation_guardian` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversation_guardian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation_staff`
--

DROP TABLE IF EXISTS `conversation_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation_staff` (
  `conversation_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  PRIMARY KEY (`conversation_id`,`staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `conversation_staff_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `conversation_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation_staff`
--

LOCK TABLES `conversation_staff` WRITE;
/*!40000 ALTER TABLE `conversation_staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversation_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_review`
--

DROP TABLE IF EXISTS `document_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_type` enum('alumno','padre','personal','acta','salida','permiso','otro') DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  `reviewer_id` int(11) DEFAULT NULL,
  `review_date` timestamp NULL DEFAULT NULL,
  `status` enum('pendiente','verificado','rechazado') DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `verified_delivery` tinyint(1) DEFAULT 0,
  `delivery_verified_by` int(11) DEFAULT NULL,
  `delivery_verified_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviewer_id` (`reviewer_id`),
  KEY `delivery_verified_by` (`delivery_verified_by`),
  KEY `idx_document_review_type_status` (`document_type`,`status`),
  CONSTRAINT `document_review_ibfk_1` FOREIGN KEY (`reviewer_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `document_review_ibfk_2` FOREIGN KEY (`delivery_verified_by`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_review`
--

LOCK TABLES `document_review` WRITE;
/*!40000 ALTER TABLE `document_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_contact_types`
--

DROP TABLE IF EXISTS `emergency_contact_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_contact_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL COMMENT 'Nombre del tipo de contacto',
  `description` text DEFAULT NULL,
  `priority_order` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_contact_types`
--

LOCK TABLES `emergency_contact_types` WRITE;
/*!40000 ALTER TABLE `emergency_contact_types` DISABLE KEYS */;
INSERT INTO `emergency_contact_types` VALUES
(1,'Padre','Contacto de emergencia - Padre',1),
(2,'Madre','Contacto de emergencia - Madre',2),
(3,'Tutor','Contacto de emergencia - Tutor legal',3),
(4,'Abuelo/Abuela','Contacto de emergencia - Familiar cercano',4),
(5,'Otro Familiar','Contacto de emergencia - Otro familiar',5),
(6,'Vecino','Contacto de emergencia - Vecino de confianza',6);
/*!40000 ALTER TABLE `emergency_contact_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guardian`
--

DROP TABLE IF EXISTS `guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `guardian` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` text DEFAULT NULL,
  `middle_name_optional` text DEFAULT NULL,
  `paternal_surname` text DEFAULT NULL,
  `maternal_surname` text DEFAULT NULL,
  `preferred_surname` text DEFAULT NULL,
  `dni` text DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `phone` text DEFAULT NULL,
  `email_optional` text DEFAULT NULL,
  `workplace` text DEFAULT NULL,
  `work_phone` text DEFAULT NULL,
  `authorized_pickup` tinyint(1) DEFAULT NULL,
  `authorized_change` tinyint(1) DEFAULT NULL,
  `parent_portal_user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`) USING HASH,
  KEY `address_id` (`address_id`),
  KEY `parent_portal_user_id` (`parent_portal_user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `guardian_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `guardian_ibfk_2` FOREIGN KEY (`parent_portal_user_id`) REFERENCES `parent_portal_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `guardian_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian`
--

LOCK TABLES `guardian` WRITE;
/*!40000 ALTER TABLE `guardian` DISABLE KEYS */;
/*!40000 ALTER TABLE `guardian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guardian_message`
--

DROP TABLE IF EXISTS `guardian_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `guardian_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) DEFAULT NULL,
  `sender_guardian_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `send_date` timestamp NULL DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_guardian_id` (`sender_guardian_id`),
  CONSTRAINT `guardian_message_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `guardian_message_ibfk_2` FOREIGN KEY (`sender_guardian_id`) REFERENCES `guardian` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian_message`
--

LOCK TABLES `guardian_message` WRITE;
/*!40000 ALTER TABLE `guardian_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `guardian_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_insurance_providers`
--

DROP TABLE IF EXISTS `health_insurance_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_insurance_providers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_insurance_providers`
--

LOCK TABLES `health_insurance_providers` WRITE;
/*!40000 ALTER TABLE `health_insurance_providers` DISABLE KEYS */;
INSERT INTO `health_insurance_providers` VALUES
(1,'OSDE',NULL,1);
/*!40000 ALTER TABLE `health_insurance_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_categories`
--

DROP TABLE IF EXISTS `medical_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_categories`
--

LOCK TABLES `medical_categories` WRITE;
/*!40000 ALTER TABLE `medical_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_minutes`
--

DROP TABLE IF EXISTS `meeting_minutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_minutes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_type` enum('directivos_familia','apoyo_familia','personal') DEFAULT NULL,
  `meeting_date` date DEFAULT NULL,
  `meeting_time` time DEFAULT NULL,
  `participants` text DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `conclusions` text DEFAULT NULL,
  `responsible_staff_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `responsible_staff_id` (`responsible_staff_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `meeting_minutes_ibfk_1` FOREIGN KEY (`responsible_staff_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `meeting_minutes_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `staff` (`id`),
  CONSTRAINT `meeting_minutes_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_minutes`
--

LOCK TABLES `meeting_minutes` WRITE;
/*!40000 ALTER TABLE `meeting_minutes` DISABLE KEYS */;
/*!40000 ALTER TABLE `meeting_minutes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_portal_submissions`
--

DROP TABLE IF EXISTS `parent_portal_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_portal_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending_review','approved','rejected') DEFAULT 'pending_review',
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `rejected_by` int(11) DEFAULT NULL,
  `rejected_reason` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `student_id` (`student_id`),
  KEY `approved_by` (`approved_by`),
  KEY `rejected_by` (`rejected_by`),
  CONSTRAINT `parent_portal_submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `parent_portal_users` (`id`),
  CONSTRAINT `parent_portal_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `parent_portal_submissions_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `staff` (`id`),
  CONSTRAINT `parent_portal_submissions_ibfk_4` FOREIGN KEY (`rejected_by`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_portal_submissions`
--

LOCK TABLES `parent_portal_submissions` WRITE;
/*!40000 ALTER TABLE `parent_portal_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent_portal_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_portal_users`
--

DROP TABLE IF EXISTS `parent_portal_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_portal_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `google_id` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `google_id` (`google_id`) USING HASH,
  KEY `fk_ppu_role` (`role_id`),
  CONSTRAINT `fk_ppu_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_portal_users`
--

LOCK TABLES `parent_portal_users` WRITE;
/*!40000 ALTER TABLE `parent_portal_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent_portal_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_registration_drafts`
--

DROP TABLE IF EXISTS `parent_registration_drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_registration_drafts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `form_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`form_data`)),
  `current_step` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `parent_registration_drafts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `parent_portal_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_registration_drafts`
--

LOCK TABLES `parent_registration_drafts` WRITE;
/*!40000 ALTER TABLE `parent_registration_drafts` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent_registration_drafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pediatricians`
--

DROP TABLE IF EXISTS `pediatricians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pediatricians` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pediatricians`
--

LOCK TABLES `pediatricians` WRITE;
/*!40000 ALTER TABLE `pediatricians` DISABLE KEYS */;
INSERT INTO `pediatricians` VALUES
(1,'sdfdsfdsfsd','34567890',1,'2025-12-21 23:39:24'),
(2,'dsfdfsdf','4523524324',1,'2025-12-21 23:49:30');
/*!40000 ALTER TABLE `pediatricians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_documentation`
--

DROP TABLE IF EXISTS `pending_documentation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_documentation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `document_type` text NOT NULL,
  `required_by` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `completed_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `required_by` (`required_by`),
  KEY `completed_by` (`completed_by`),
  KEY `idx_pending_documentation_student_completed` (`student_id`,`completed_at`),
  CONSTRAINT `pending_documentation_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pending_documentation_ibfk_2` FOREIGN KEY (`required_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pending_documentation_ibfk_3` FOREIGN KEY (`completed_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_documentation`
--

LOCK TABLES `pending_documentation` WRITE;
/*!40000 ALTER TABLE `pending_documentation` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending_documentation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_action`
--

DROP TABLE IF EXISTS `permission_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_name` text DEFAULT NULL,
  `action_key` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `action_key` (`action_key`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_action`
--

LOCK TABLES `permission_action` WRITE;
/*!40000 ALTER TABLE `permission_action` DISABLE KEYS */;
INSERT INTO `permission_action` VALUES
(1,'Ver','ver','Permite visualizar información'),
(2,'Crear','crear','Permite crear nuevos registros'),
(3,'Editar','editar','Permite modificar registros existentes'),
(4,'Eliminar','eliminar','Permite eliminar registros'),
(5,'Registrar','registrar','Permite registrar asistencia u otros eventos'),
(6,'Reportes','reportes','Permite generar reportes'),
(7,'Exportar','exportar','Permite exportar datos'),
(8,'Enviar','enviar','Permite enviar mensajes'),
(9,'Gestionar','gestionar','Permite gestionar configuraciones o elementos'),
(10,'Modificar','modificar','Permite modificar configuraciones');
/*!40000 ALTER TABLE `permission_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_audit_log`
--

DROP TABLE IF EXISTS `permission_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_audit_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `action_id` int(11) DEFAULT NULL,
  `previous_value` tinyint(1) DEFAULT NULL,
  `new_value` tinyint(1) DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `ip_address` text DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `module_id` (`module_id`),
  KEY `action_id` (`action_id`),
  KEY `changed_by` (`changed_by`),
  CONSTRAINT `permission_audit_log_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `permission_audit_log_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `system_module` (`id`),
  CONSTRAINT `permission_audit_log_ibfk_3` FOREIGN KEY (`action_id`) REFERENCES `permission_action` (`id`),
  CONSTRAINT `permission_audit_log_ibfk_4` FOREIGN KEY (`changed_by`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_audit_log`
--

LOCK TABLES `permission_audit_log` WRITE;
/*!40000 ALTER TABLE `permission_audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` text DEFAULT NULL,
  `access_level_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `access_level_id` (`access_level_id`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`access_level_id`) REFERENCES `access_level` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES
(1,'Administrator',1),
(2,'Director',2),
(3,'Teacher',3),
(4,'Secretary',4),
(5,'Tutor',5),
(6,'Preceptor',3),
(7,'Maestra de Música',3),
(8,'Maestra de Arte',3),
(9,'Maestra de Expresión Corporal',3),
(10,'Parent',5),
(11,'Administrator',6),
(12,'Administrator',6);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `role_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `action_id` int(11) NOT NULL,
  `is_granted` tinyint(1) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`role_id`,`module_id`,`action_id`),
  KEY `module_id` (`module_id`),
  KEY `action_id` (`action_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `system_module` (`id`),
  CONSTRAINT `role_permission_ibfk_3` FOREIGN KEY (`action_id`) REFERENCES `permission_action` (`id`),
  CONSTRAINT `role_permission_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
INSERT INTO `role_permission` VALUES
(1,1,1,1,1,'2025-12-21 23:20:18'),
(1,1,2,1,1,'2025-12-21 23:20:18'),
(1,1,3,1,1,'2025-12-21 23:20:18'),
(1,1,4,1,1,'2025-12-21 23:20:18'),
(1,1,5,1,1,'2025-12-21 23:20:18'),
(1,1,6,1,1,'2025-12-21 23:20:18'),
(1,1,7,1,1,'2025-12-21 23:20:18'),
(1,1,8,1,1,'2025-12-21 23:20:18'),
(1,1,9,1,1,'2025-12-21 23:20:18'),
(1,1,10,1,1,'2025-12-21 23:20:18'),
(1,2,1,1,1,'2025-12-21 23:20:18'),
(1,2,2,1,1,'2025-12-21 23:20:18'),
(1,2,3,1,1,'2025-12-21 23:20:18'),
(1,2,4,1,1,'2025-12-21 23:20:18'),
(1,2,5,1,1,'2025-12-21 23:20:18'),
(1,2,6,1,1,'2025-12-21 23:20:18'),
(1,2,7,1,1,'2025-12-21 23:20:18'),
(1,2,8,1,1,'2025-12-21 23:20:18'),
(1,2,9,1,1,'2025-12-21 23:20:18'),
(1,2,10,1,1,'2025-12-21 23:20:18'),
(1,3,1,1,1,'2025-12-21 23:20:18'),
(1,3,2,1,1,'2025-12-21 23:20:18'),
(1,3,3,1,1,'2025-12-21 23:20:18'),
(1,3,4,1,1,'2025-12-21 23:20:18'),
(1,3,5,1,1,'2025-12-21 23:20:18'),
(1,3,6,1,1,'2025-12-21 23:20:18'),
(1,3,7,1,1,'2025-12-21 23:20:18'),
(1,3,8,1,1,'2025-12-21 23:20:18'),
(1,3,9,1,1,'2025-12-21 23:20:18'),
(1,3,10,1,1,'2025-12-21 23:20:18'),
(1,4,1,1,1,'2025-12-21 23:20:18'),
(1,4,2,1,1,'2025-12-21 23:20:18'),
(1,4,3,1,1,'2025-12-21 23:20:18'),
(1,4,4,1,1,'2025-12-21 23:20:18'),
(1,4,5,1,1,'2025-12-21 23:20:18'),
(1,4,6,1,1,'2025-12-21 23:20:18'),
(1,4,7,1,1,'2025-12-21 23:20:18'),
(1,4,8,1,1,'2025-12-21 23:20:18'),
(1,4,9,1,1,'2025-12-21 23:20:18'),
(1,4,10,1,1,'2025-12-21 23:20:18'),
(1,5,1,1,1,'2025-12-21 23:20:18'),
(1,5,2,1,1,'2025-12-21 23:20:18'),
(1,5,3,1,1,'2025-12-21 23:20:18'),
(1,5,4,1,1,'2025-12-21 23:20:18'),
(1,5,5,1,1,'2025-12-21 23:20:18'),
(1,5,6,1,1,'2025-12-21 23:20:18'),
(1,5,7,1,1,'2025-12-21 23:20:18'),
(1,5,8,1,1,'2025-12-21 23:20:18'),
(1,5,9,1,1,'2025-12-21 23:20:18'),
(1,5,10,1,1,'2025-12-21 23:20:18'),
(1,6,1,1,1,'2025-12-21 23:20:18'),
(1,6,2,1,1,'2025-12-21 23:20:18'),
(1,6,3,1,1,'2025-12-21 23:20:18'),
(1,6,4,1,1,'2025-12-21 23:20:18'),
(1,6,5,1,1,'2025-12-21 23:20:18'),
(1,6,6,1,1,'2025-12-21 23:20:18'),
(1,6,7,1,1,'2025-12-21 23:20:18'),
(1,6,8,1,1,'2025-12-21 23:20:18'),
(1,6,9,1,1,'2025-12-21 23:20:18'),
(1,6,10,1,1,'2025-12-21 23:20:18'),
(1,7,1,1,1,'2025-12-21 23:20:18'),
(1,7,2,1,1,'2025-12-21 23:20:18'),
(1,7,3,1,1,'2025-12-21 23:20:18'),
(1,7,4,1,1,'2025-12-21 23:20:18'),
(1,7,5,1,1,'2025-12-21 23:20:18'),
(1,7,6,1,1,'2025-12-21 23:20:18'),
(1,7,7,1,1,'2025-12-21 23:20:18'),
(1,7,8,1,1,'2025-12-21 23:20:18'),
(1,7,9,1,1,'2025-12-21 23:20:18'),
(1,7,10,1,1,'2025-12-21 23:20:18'),
(1,8,1,1,1,'2025-12-21 23:20:18'),
(1,8,2,1,1,'2025-12-21 23:20:18'),
(1,8,3,1,1,'2025-12-21 23:20:18'),
(1,8,4,1,1,'2025-12-21 23:20:18'),
(1,8,5,1,1,'2025-12-21 23:20:18'),
(1,8,6,1,1,'2025-12-21 23:20:18'),
(1,8,7,1,1,'2025-12-21 23:20:18'),
(1,8,8,1,1,'2025-12-21 23:20:18'),
(1,8,9,1,1,'2025-12-21 23:20:18'),
(1,8,10,1,1,'2025-12-21 23:20:18'),
(1,9,1,1,1,'2025-12-21 23:20:18'),
(1,9,2,1,1,'2025-12-21 23:20:18'),
(1,9,3,1,1,'2025-12-21 23:20:18'),
(1,9,4,1,1,'2025-12-21 23:20:18'),
(1,9,5,1,1,'2025-12-21 23:20:18'),
(1,9,6,1,1,'2025-12-21 23:20:18'),
(1,9,7,1,1,'2025-12-21 23:20:18'),
(1,9,8,1,1,'2025-12-21 23:20:18'),
(1,9,9,1,1,'2025-12-21 23:20:18'),
(1,9,10,1,1,'2025-12-21 23:20:18'),
(1,10,1,1,1,'2025-12-21 23:20:18'),
(1,10,2,1,1,'2025-12-21 23:20:18'),
(1,10,3,1,1,'2025-12-21 23:20:18'),
(1,10,4,1,1,'2025-12-21 23:20:18'),
(1,10,5,1,1,'2025-12-21 23:20:18'),
(1,10,6,1,1,'2025-12-21 23:20:18'),
(1,10,7,1,1,'2025-12-21 23:20:18'),
(1,10,8,1,1,'2025-12-21 23:20:18'),
(1,10,9,1,1,'2025-12-21 23:20:18'),
(1,10,10,1,1,'2025-12-21 23:20:18'),
(2,1,1,1,1,'2025-12-21 23:20:18'),
(2,1,2,1,1,'2025-12-21 23:20:18'),
(2,1,3,1,1,'2025-12-21 23:20:18'),
(2,1,4,1,1,'2025-12-21 23:20:18'),
(2,1,5,1,1,'2025-12-21 23:20:18'),
(2,1,6,1,1,'2025-12-21 23:20:18'),
(2,1,7,1,1,'2025-12-21 23:20:18'),
(2,1,8,1,1,'2025-12-21 23:20:18'),
(2,1,9,1,1,'2025-12-21 23:20:18'),
(2,1,10,1,1,'2025-12-21 23:20:18'),
(2,2,1,1,1,'2025-12-21 23:20:18'),
(2,2,2,1,1,'2025-12-21 23:20:18'),
(2,2,3,1,1,'2025-12-21 23:20:18'),
(2,2,4,1,1,'2025-12-21 23:20:18'),
(2,2,5,1,1,'2025-12-21 23:20:18'),
(2,2,6,1,1,'2025-12-21 23:20:18'),
(2,2,7,1,1,'2025-12-21 23:20:18'),
(2,2,8,1,1,'2025-12-21 23:20:18'),
(2,2,9,1,1,'2025-12-21 23:20:18'),
(2,2,10,1,1,'2025-12-21 23:20:18'),
(2,3,1,1,1,'2025-12-21 23:20:18'),
(2,3,2,1,1,'2025-12-21 23:20:18'),
(2,3,3,1,1,'2025-12-21 23:20:18'),
(2,3,4,1,1,'2025-12-21 23:20:18'),
(2,3,5,1,1,'2025-12-21 23:20:18'),
(2,3,6,1,1,'2025-12-21 23:20:18'),
(2,3,7,1,1,'2025-12-21 23:20:18'),
(2,3,8,1,1,'2025-12-21 23:20:18'),
(2,3,9,1,1,'2025-12-21 23:20:18'),
(2,3,10,1,1,'2025-12-21 23:20:18'),
(2,4,1,1,1,'2025-12-21 23:20:18'),
(2,4,2,1,1,'2025-12-21 23:20:18'),
(2,4,3,1,1,'2025-12-21 23:20:18'),
(2,4,4,1,1,'2025-12-21 23:20:18'),
(2,4,5,1,1,'2025-12-21 23:20:18'),
(2,4,6,1,1,'2025-12-21 23:20:18'),
(2,4,7,1,1,'2025-12-21 23:20:18'),
(2,4,8,1,1,'2025-12-21 23:20:18'),
(2,4,9,1,1,'2025-12-21 23:20:18'),
(2,4,10,1,1,'2025-12-21 23:20:18'),
(2,5,1,1,1,'2025-12-21 23:20:18'),
(2,5,2,1,1,'2025-12-21 23:20:18'),
(2,5,3,1,1,'2025-12-21 23:20:18'),
(2,5,4,1,1,'2025-12-21 23:20:18'),
(2,5,5,1,1,'2025-12-21 23:20:18'),
(2,5,6,1,1,'2025-12-21 23:20:18'),
(2,5,7,1,1,'2025-12-21 23:20:18'),
(2,5,8,1,1,'2025-12-21 23:20:18'),
(2,5,9,1,1,'2025-12-21 23:20:18'),
(2,5,10,1,1,'2025-12-21 23:20:18'),
(2,6,1,1,1,'2025-12-21 23:20:18'),
(2,6,2,1,1,'2025-12-21 23:20:18'),
(2,6,3,1,1,'2025-12-21 23:20:18'),
(2,6,4,1,1,'2025-12-21 23:20:18'),
(2,6,5,1,1,'2025-12-21 23:20:18'),
(2,6,6,1,1,'2025-12-21 23:20:18'),
(2,6,7,1,1,'2025-12-21 23:20:18'),
(2,6,8,1,1,'2025-12-21 23:20:18'),
(2,6,9,1,1,'2025-12-21 23:20:18'),
(2,6,10,1,1,'2025-12-21 23:20:18'),
(2,7,1,1,1,'2025-12-21 23:20:18'),
(2,7,2,1,1,'2025-12-21 23:20:18'),
(2,7,3,1,1,'2025-12-21 23:20:18'),
(2,7,4,1,1,'2025-12-21 23:20:18'),
(2,7,5,1,1,'2025-12-21 23:20:18'),
(2,7,6,1,1,'2025-12-21 23:20:18'),
(2,7,7,1,1,'2025-12-21 23:20:18'),
(2,7,8,1,1,'2025-12-21 23:20:18'),
(2,7,9,1,1,'2025-12-21 23:20:18'),
(2,7,10,1,1,'2025-12-21 23:20:18'),
(2,8,1,1,1,'2025-12-21 23:20:18'),
(2,8,2,1,1,'2025-12-21 23:20:18'),
(2,8,3,1,1,'2025-12-21 23:20:18'),
(2,8,4,1,1,'2025-12-21 23:20:18'),
(2,8,5,1,1,'2025-12-21 23:20:18'),
(2,8,6,1,1,'2025-12-21 23:20:18'),
(2,8,7,1,1,'2025-12-21 23:20:18'),
(2,8,8,1,1,'2025-12-21 23:20:18'),
(2,8,9,1,1,'2025-12-21 23:20:18'),
(2,8,10,1,1,'2025-12-21 23:20:18'),
(2,9,1,1,1,'2025-12-21 23:20:18'),
(2,9,2,1,1,'2025-12-21 23:20:18'),
(2,9,3,1,1,'2025-12-21 23:20:18'),
(2,9,4,1,1,'2025-12-21 23:20:18'),
(2,9,5,1,1,'2025-12-21 23:20:18'),
(2,9,6,1,1,'2025-12-21 23:20:18'),
(2,9,7,1,1,'2025-12-21 23:20:18'),
(2,9,8,1,1,'2025-12-21 23:20:18'),
(2,9,9,1,1,'2025-12-21 23:20:18'),
(2,9,10,1,1,'2025-12-21 23:20:18'),
(3,1,1,1,1,'2025-12-21 23:20:18'),
(3,1,3,1,1,'2025-12-21 23:20:18'),
(3,1,5,1,1,'2025-12-21 23:20:18'),
(3,1,8,1,1,'2025-12-21 23:20:18'),
(3,2,1,1,1,'2025-12-21 23:20:18'),
(3,2,3,1,1,'2025-12-21 23:20:18'),
(3,2,5,1,1,'2025-12-21 23:20:18'),
(3,2,8,1,1,'2025-12-21 23:20:18'),
(3,3,1,1,1,'2025-12-21 23:20:18'),
(3,3,3,1,1,'2025-12-21 23:20:18'),
(3,3,5,1,1,'2025-12-21 23:20:18'),
(3,3,8,1,1,'2025-12-21 23:20:18'),
(3,6,1,1,1,'2025-12-21 23:20:18'),
(3,6,3,1,1,'2025-12-21 23:20:18'),
(3,6,5,1,1,'2025-12-21 23:20:18'),
(3,6,8,1,1,'2025-12-21 23:20:18'),
(3,8,1,1,1,'2025-12-21 23:20:18'),
(3,8,3,1,1,'2025-12-21 23:20:18'),
(3,8,5,1,1,'2025-12-21 23:20:18'),
(3,8,8,1,1,'2025-12-21 23:20:18'),
(4,1,1,1,1,'2025-12-21 23:20:18'),
(4,1,2,1,1,'2025-12-21 23:20:18'),
(4,1,3,1,1,'2025-12-21 23:20:18'),
(4,1,7,1,1,'2025-12-21 23:20:18'),
(4,1,8,1,1,'2025-12-21 23:20:18'),
(4,2,1,1,1,'2025-12-21 23:20:18'),
(4,2,2,1,1,'2025-12-21 23:20:18'),
(4,2,3,1,1,'2025-12-21 23:20:18'),
(4,2,7,1,1,'2025-12-21 23:20:18'),
(4,2,8,1,1,'2025-12-21 23:20:18'),
(4,5,1,1,1,'2025-12-21 23:20:18'),
(4,5,2,1,1,'2025-12-21 23:20:18'),
(4,5,3,1,1,'2025-12-21 23:20:18'),
(4,5,7,1,1,'2025-12-21 23:20:18'),
(4,5,8,1,1,'2025-12-21 23:20:18'),
(4,7,1,1,1,'2025-12-21 23:20:18'),
(4,7,2,1,1,'2025-12-21 23:20:18'),
(4,7,3,1,1,'2025-12-21 23:20:18'),
(4,7,7,1,1,'2025-12-21 23:20:18'),
(4,7,8,1,1,'2025-12-21 23:20:18'),
(4,8,1,1,1,'2025-12-21 23:20:18'),
(4,8,2,1,1,'2025-12-21 23:20:18'),
(4,8,3,1,1,'2025-12-21 23:20:18'),
(4,8,7,1,1,'2025-12-21 23:20:18'),
(4,8,8,1,1,'2025-12-21 23:20:18'),
(5,2,1,1,1,'2025-12-27 11:13:05'),
(5,2,2,1,1,'2025-12-21 23:20:18'),
(5,2,3,1,1,'2025-12-27 11:13:06'),
(5,2,4,1,1,'2025-12-27 11:13:08'),
(5,2,5,1,1,'2025-12-27 11:13:09'),
(5,2,9,1,1,'2025-12-27 11:13:12'),
(5,2,10,1,1,'2025-12-27 11:13:14'),
(10,2,1,1,NULL,'2025-12-27 02:53:15'),
(10,2,2,1,NULL,'2025-12-27 02:53:15'),
(10,2,3,1,1,'2025-12-27 11:12:48'),
(10,2,4,1,1,'2025-12-27 11:12:46'),
(10,2,5,1,1,'2025-12-27 11:12:39'),
(10,2,9,1,1,'2025-12-27 11:12:43'),
(10,2,10,1,1,'2025-12-27 11:12:44');
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(20) NOT NULL COMMENT 'Nombre del turno',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shift_name` (`shift_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES
(1,'Mañana','Turno de mañana',1),
(2,'Tarde','Turno de tarde',1),
(3,'Completo','Turno completo',1),
(4,'Mañana y Tarde','Turno completo con jornada extendida',1);
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` text DEFAULT NULL,
  `middle_name_optional` text DEFAULT NULL,
  `third_name_optional` text DEFAULT NULL,
  `paternal_surname` text DEFAULT NULL,
  `maternal_surname` text DEFAULT NULL,
  `dni` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `password_hash` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `preferred_surname` text DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `phone` text DEFAULT NULL,
  `email_optional` text DEFAULT NULL,
  `classroom_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`) USING HASH,
  UNIQUE KEY `email` (`email`) USING HASH,
  KEY `address_id` (`address_id`),
  KEY `classroom_id` (`classroom_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`),
  CONSTRAINT `staff_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES
(1,'Admin',NULL,NULL,'User',NULL,NULL,'admin@kindergarten.com','$2b$10$p0k.m554O2pNZonFTs4yUe9lfheKwmGfeB6KiAYKKh7CxaMDySvwq',1,'2025-12-29 10:17:32','2025-12-21 23:20:18',NULL,1,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_message`
--

DROP TABLE IF EXISTS `staff_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) DEFAULT NULL,
  `sender_staff_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `send_date` timestamp NULL DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_staff_id` (`sender_staff_id`),
  CONSTRAINT `staff_message_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `staff_message_ibfk_2` FOREIGN KEY (`sender_staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_message`
--

LOCK TABLES `staff_message` WRITE;
/*!40000 ALTER TABLE `staff_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` text DEFAULT NULL,
  `middle_name_optional` text DEFAULT NULL,
  `third_name_optional` text DEFAULT NULL,
  `paternal_surname` text DEFAULT NULL,
  `maternal_surname` text DEFAULT NULL,
  `nickname_optional` text DEFAULT NULL,
  `dni` text DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `classroom_id` int(11) DEFAULT NULL,
  `shift` text DEFAULT NULL,
  `status` enum('preinscripto','pendiente','approved','sorteo','inscripto','activo','inactivo','egresado','rechazado') DEFAULT NULL,
  `enrollment_date` date DEFAULT NULL,
  `withdrawal_date` date DEFAULT NULL,
  `health_insurance` text DEFAULT NULL,
  `affiliate_number` text DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `medications` text DEFAULT NULL,
  `medical_observations` text DEFAULT NULL,
  `blood_type` text DEFAULT NULL,
  `pediatrician_name` text DEFAULT NULL,
  `pediatrician_phone` text DEFAULT NULL,
  `photo_authorization` tinyint(1) DEFAULT NULL,
  `trip_authorization` tinyint(1) DEFAULT NULL,
  `medical_attention_authorization` tinyint(1) DEFAULT NULL,
  `has_siblings_in_school` tinyint(1) DEFAULT NULL,
  `special_needs` text DEFAULT NULL,
  `vaccination_status` enum('completo','incompleto','pendiente','no_informado') DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `blood_type_id` int(11) DEFAULT NULL,
  `shift_id` int(11) DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`) USING HASH,
  KEY `address_id` (`address_id`),
  KEY `classroom_id` (`classroom_id`),
  KEY `blood_type_id` (`blood_type_id`),
  KEY `shift_id` (`shift_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`),
  CONSTRAINT `student_ibfk_3` FOREIGN KEY (`blood_type_id`) REFERENCES `blood_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `student_ibfk_4` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_documents`
--

DROP TABLE IF EXISTS `student_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `document_type` enum('dni','certificado_nacimiento','certificado_vacunas','certificado_medico','autorizacion_firmada','foto','otro') DEFAULT NULL,
  `file_name` text DEFAULT NULL,
  `file_path` text DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `mime_type` text DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT NULL,
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `delivery_verified` tinyint(1) DEFAULT 0,
  `delivery_verified_by` int(11) DEFAULT NULL,
  `delivery_verified_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `verified_by` (`verified_by`),
  KEY `delivery_verified_by` (`delivery_verified_by`),
  CONSTRAINT `student_documents_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `student_documents_ibfk_2` FOREIGN KEY (`verified_by`) REFERENCES `staff` (`id`),
  CONSTRAINT `student_documents_ibfk_3` FOREIGN KEY (`delivery_verified_by`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_documents`
--

LOCK TABLES `student_documents` WRITE;
/*!40000 ALTER TABLE `student_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_guardian`
--

DROP TABLE IF EXISTS `student_guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_guardian` (
  `student_id` int(11) NOT NULL,
  `guardian_id` int(11) NOT NULL,
  `relationship_type` varchar(50) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT NULL,
  `is_emergency` tinyint(1) DEFAULT 0 COMMENT 'Contacto de emergencia prioritario',
  `authorized_pickup` tinyint(1) DEFAULT NULL,
  `authorized_diaper_change` tinyint(1) DEFAULT NULL,
  `custody_rights` tinyint(1) DEFAULT NULL,
  `financial_responsible` tinyint(1) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `can_pickup` tinyint(1) DEFAULT 0 COMMENT 'Autorizado a retirar al alumno',
  `has_restraining_order` tinyint(1) DEFAULT 0 COMMENT 'Posee restricción judicial para contacto',
  `can_change_diaper` tinyint(1) DEFAULT 0 COMMENT 'Autorizado a cambiar pañales',
  PRIMARY KEY (`student_id`,`guardian_id`),
  KEY `guardian_id` (`guardian_id`),
  CONSTRAINT `student_guardian_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `student_guardian_ibfk_2` FOREIGN KEY (`guardian_id`) REFERENCES `guardian` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_guardian`
--

LOCK TABLES `student_guardian` WRITE;
/*!40000 ALTER TABLE `student_guardian` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_guardian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_status_history`
--

DROP TABLE IF EXISTS `student_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `old_status` enum('preinscripto','pendiente','approved','sorteo','inscripto','activo','inactivo','egresado','rechazado') DEFAULT NULL,
  `new_status` enum('preinscripto','pendiente','approved','sorteo','inscripto','activo','inactivo','egresado','rechazado') DEFAULT NULL,
  `change_date` timestamp NULL DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_status_history_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_status_history`
--

LOCK TABLES `student_status_history` WRITE;
/*!40000 ALTER TABLE `student_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_module`
--

DROP TABLE IF EXISTS `system_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` text DEFAULT NULL,
  `module_key` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_key` (`module_key`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_module`
--

LOCK TABLES `system_module` WRITE;
/*!40000 ALTER TABLE `system_module` DISABLE KEYS */;
INSERT INTO `system_module` VALUES
(1,'Dashboard','dashboard','Visión general del sistema',1,1),
(2,'Alumnos','alumnos','Gestión de información de alumnos',1,2),
(3,'Salas','salas','Gestión de salas y asignación de alumnos',1,3),
(4,'Personal','personal','Gestión de información del personal',1,4),
(5,'Responsables','responsables','Gestión de tutores y responsables',1,5),
(6,'Asistencia','asistencia','Registro y gestión de asistencia',1,6),
(7,'Reportes','reportes','Generación de informes y estadísticas',1,7),
(8,'Mensajería','mensajeria','Comunicación interna con padres y personal',1,8),
(9,'Configuración','configuracion','Configuración de permisos y roles',1,9),
(10,'Roles','roles','Gestión de roles del sistema',1,10);
/*!40000 ALTER TABLE `system_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `v_lottery_list`
--

DROP TABLE IF EXISTS `v_lottery_list`;
/*!50001 DROP VIEW IF EXISTS `v_lottery_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_lottery_list` AS SELECT
 1 AS `id`,
  1 AS `full_name`,
  1 AS `dni`,
  1 AS `birth_date`,
  1 AS `shift`,
  1 AS `health_insurance`,
  1 AS `has_siblings_in_school`,
  1 AS `enrollment_date`,
  1 AS `submitted_at`,
  1 AS `approved_at`,
  1 AS `status`,
  1 AS `classroom_name`,
  1 AS `guardian_first_name`,
  1 AS `guardian_paternal_surname`,
  1 AS `guardian_phone` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_lottery_list_simple`
--

DROP TABLE IF EXISTS `v_lottery_list_simple`;
/*!50001 DROP VIEW IF EXISTS `v_lottery_list_simple`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_lottery_list_simple` AS SELECT
 1 AS `id`,
  1 AS `full_name`,
  1 AS `dni` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_preinscriptos_with_pending_docs`
--

DROP TABLE IF EXISTS `v_preinscriptos_with_pending_docs`;
/*!50001 DROP VIEW IF EXISTS `v_preinscriptos_with_pending_docs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_preinscriptos_with_pending_docs` AS SELECT
 1 AS `id`,
  1 AS `full_name`,
  1 AS `dni`,
  1 AS `status`,
  1 AS `document_type`,
  1 AS `notes`,
  1 AS `upload_date`,
  1 AS `delivery_verified`,
  1 AS `delivery_verified_by_name` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_role_permissions`
--

DROP TABLE IF EXISTS `v_role_permissions`;
/*!50001 DROP VIEW IF EXISTS `v_role_permissions`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_role_permissions` AS SELECT
 1 AS `role_id`,
  1 AS `role_name`,
  1 AS `module_id`,
  1 AS `module_name`,
  1 AS `module_key`,
  1 AS `action_id`,
  1 AS `action_name`,
  1 AS `action_key`,
  1 AS `has_permission` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_students_pending_document_delivery`
--

DROP TABLE IF EXISTS `v_students_pending_document_delivery`;
/*!50001 DROP VIEW IF EXISTS `v_students_pending_document_delivery`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_students_pending_document_delivery` AS SELECT
 1 AS `id`,
  1 AS `full_name`,
  1 AS `dni`,
  1 AS `status`,
  1 AS `total_documents`,
  1 AS `verified_deliveries` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_students_with_pending_docs`
--

DROP TABLE IF EXISTS `v_students_with_pending_docs`;
/*!50001 DROP VIEW IF EXISTS `v_students_with_pending_docs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_students_with_pending_docs` AS SELECT
 1 AS `id`,
  1 AS `full_name`,
  1 AS `dni`,
  1 AS `status`,
  1 AS `classroom_id`,
  1 AS `classroom_name`,
  1 AS `document_type`,
  1 AS `notes`,
  1 AS `required_date`,
  1 AS `completed_at`,
  1 AS `completed_by_name`,
  1 AS `vaccination_status` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `vaccination_records`
--

DROP TABLE IF EXISTS `vaccination_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccination_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `vaccine_name` text DEFAULT NULL,
  `vaccine_date` date DEFAULT NULL,
  `batch_number` text DEFAULT NULL,
  `dose_number` int(11) DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  `status` enum('activo','faltante','completo','exento') DEFAULT NULL,
  `administered_by` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_vaccination_records_student_status` (`student_id`,`status`),
  CONSTRAINT `vaccination_records_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccination_records`
--

LOCK TABLES `vaccination_records` WRITE;
/*!40000 ALTER TABLE `vaccination_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `vaccination_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'kindergarten_db'
--

--
-- Dumping routines for database 'kindergarten_db'
--

--
-- Final view structure for view `v_lottery_list`
--

/*!50001 DROP VIEW IF EXISTS `v_lottery_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_lottery_list` AS select `s`.`id` AS `id`,concat(`s`.`first_name`,' ',`s`.`paternal_surname`,ifnull(concat(' ',`s`.`maternal_surname`),'')) AS `full_name`,`s`.`dni` AS `dni`,`s`.`birth_date` AS `birth_date`,`s`.`shift` AS `shift`,`s`.`health_insurance` AS `health_insurance`,`s`.`has_siblings_in_school` AS `has_siblings_in_school`,`s`.`enrollment_date` AS `enrollment_date`,`pps`.`submitted_at` AS `submitted_at`,`pps`.`approved_at` AS `approved_at`,`s`.`status` AS `status`,`c`.`name` AS `classroom_name`,`g`.`first_name` AS `guardian_first_name`,`g`.`paternal_surname` AS `guardian_paternal_surname`,`g`.`phone` AS `guardian_phone` from ((((`student` `s` left join `parent_portal_submissions` `pps` on(`s`.`id` = `pps`.`student_id`)) left join `classroom` `c` on(`s`.`classroom_id` = `c`.`id`)) left join `student_guardian` `sg` on(`s`.`id` = `sg`.`student_id` and `sg`.`is_primary` = 1)) left join `guardian` `g` on(`sg`.`guardian_id` = `g`.`id`)) where `s`.`status` = 'sorteo' order by `pps`.`approved_at` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_lottery_list_simple`
--

/*!50001 DROP VIEW IF EXISTS `v_lottery_list_simple`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_lottery_list_simple` AS select `s`.`id` AS `id`,concat(`s`.`first_name`,' ',`s`.`paternal_surname`,ifnull(concat(' ',`s`.`maternal_surname`),'')) AS `full_name`,`s`.`dni` AS `dni` from `student` `s` where `s`.`status` = 'sorteo' order by `s`.`enrollment_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_preinscriptos_with_pending_docs`
--

/*!50001 DROP VIEW IF EXISTS `v_preinscriptos_with_pending_docs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_preinscriptos_with_pending_docs` AS select `s`.`id` AS `id`,concat(`s`.`first_name`,' ',`s`.`paternal_surname`,ifnull(concat(' ',`s`.`maternal_surname`),'')) AS `full_name`,`s`.`dni` AS `dni`,`s`.`status` AS `status`,`sd`.`document_type` AS `document_type`,`sd`.`notes` AS `notes`,`sd`.`upload_date` AS `upload_date`,`sd`.`delivery_verified` AS `delivery_verified`,concat(`verified_by`.`first_name`,' ',`verified_by`.`paternal_surname`) AS `delivery_verified_by_name` from ((`student` `s` left join `student_documents` `sd` on(`s`.`id` = `sd`.`student_id`)) left join `staff` `verified_by` on(`sd`.`delivery_verified_by` = `verified_by`.`id`)) where `s`.`status` = 'preinscripto' order by `s`.`id`,`sd`.`upload_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_role_permissions`
--

/*!50001 DROP VIEW IF EXISTS `v_role_permissions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_role_permissions` AS select `r`.`id` AS `role_id`,`r`.`role_name` AS `role_name`,`sm`.`id` AS `module_id`,`sm`.`module_name` AS `module_name`,`sm`.`module_key` AS `module_key`,`pa`.`id` AS `action_id`,`pa`.`action_name` AS `action_name`,`pa`.`action_key` AS `action_key`,coalesce(`rp`.`is_granted`,0) AS `has_permission` from (((`role` `r` join `system_module` `sm`) join `permission_action` `pa`) left join `role_permission` `rp` on(`r`.`id` = `rp`.`role_id` and `sm`.`id` = `rp`.`module_id` and `pa`.`id` = `rp`.`action_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_students_pending_document_delivery`
--

/*!50001 DROP VIEW IF EXISTS `v_students_pending_document_delivery`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_students_pending_document_delivery` AS select `s`.`id` AS `id`,concat(`s`.`first_name`,' ',`s`.`paternal_surname`,ifnull(concat(' ',`s`.`maternal_surname`),'')) AS `full_name`,`s`.`dni` AS `dni`,`s`.`status` AS `status`,count(`sd`.`id`) AS `total_documents`,sum(case when `sd`.`delivery_verified` = 1 then 1 else 0 end) AS `verified_deliveries` from (`student` `s` left join `student_documents` `sd` on(`s`.`id` = `sd`.`student_id`)) where `s`.`status` = 'preinscripto' group by `s`.`id` order by `s`.`enrollment_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_students_with_pending_docs`
--

/*!50001 DROP VIEW IF EXISTS `v_students_with_pending_docs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_students_with_pending_docs` AS select `s`.`id` AS `id`,concat(`s`.`first_name`,' ',`s`.`paternal_surname`,ifnull(concat(' ',`s`.`maternal_surname`),'')) AS `full_name`,`s`.`dni` AS `dni`,`s`.`status` AS `status`,`s`.`classroom_id` AS `classroom_id`,`c`.`name` AS `classroom_name`,`pd`.`document_type` AS `document_type`,`pd`.`notes` AS `notes`,`pd`.`created_at` AS `required_date`,`pd`.`completed_at` AS `completed_at`,concat(`completed_by`.`first_name`,' ',`completed_by`.`paternal_surname`) AS `completed_by_name`,`s`.`vaccination_status` AS `vaccination_status` from (((`student` `s` left join `pending_documentation` `pd` on(`s`.`id` = `pd`.`student_id` and `pd`.`completed_at` is null)) left join `classroom` `c` on(`s`.`classroom_id` = `c`.`id`)) left join `staff` `completed_by` on(`pd`.`completed_by` = `completed_by`.`id`)) where `s`.`status` in ('inscripto','activo') and `pd`.`id` is not null order by `s`.`id`,`pd`.`created_at` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-29  9:50:03
