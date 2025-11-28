/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: kindergarten_db
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `access_level`
--

DROP TABLE IF EXISTS `access_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_level` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `access_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_level`
--

LOCK TABLES `access_level` WRITE;
/*!40000 ALTER TABLE `access_level` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `access_level` VALUES
(1,'Administrador','Acceso completo a todas las funciones'),
(2,'Secretaria','Gestionar datos de alumnos y padres'),
(3,'Maestro','Ver datos de alumnos asignados'),
(4,'Director','Acceso completo con responsabilidades de dirección'),
(5,'Tutor','Acceso limitado para ver información de sus hijos');
/*!40000 ALTER TABLE `access_level` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` text DEFAULT NULL,
  `description_optional` text DEFAULT NULL,
  `schedule_optional` text DEFAULT NULL,
  `teacher_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `street` text DEFAULT NULL,
  `number` text DEFAULT NULL,
  `city` text DEFAULT NULL,
  `provincia` text DEFAULT NULL,
  `postal_code_optional` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `address` VALUES
(1,NULL,NULL,NULL,'Buenos Aires',NULL),
(2,'Calle Mitre','892','Tandil','Buenos Aires','B7000'),
(3,'Calle 9 de Julio','456','Tandil','Buenos Aires','B7001'),
(4,'Avenida Colón','2341','Tandil','Buenos Aires','B7000'),
(5,'Calle Salta','1961','Tandil','Buenos Aires','B7000'),
(6,'Calle Pinto','567','Tandil','Buenos Aires','B7001'),
(7,'Calle Rivadavia','1234','Tandil','Buenos Aires','B7000'),
(8,'Avenida Avellaneda','3456','Tandil','Buenos Aires','B7002'),
(9,'Calle Chacabuco','789','Tandil','Buenos Aires','B7000'),
(10,'Calle Belgrano','2100','Tandil','Buenos Aires','B7001'),
(11,'Avenida Santamarina','1800','Tandil','Buenos Aires','B7000'),
(12,NULL,NULL,NULL,'Buenos Aires',NULL),
(13,'Calle Güemes','1450','Tandil','Buenos Aires','B7001'),
(14,'Avenida España','2890','Tandil','Buenos Aires','B7002'),
(15,'Calle San Lorenzo','678','Tandil','Buenos Aires','B7000'),
(19,'df','456','fgs','dfdf',NULL);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` text DEFAULT NULL,
  `leave_type_optional` text DEFAULT NULL,
  `classroom_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `calendar`
--

DROP TABLE IF EXISTS `calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `event_type` text DEFAULT NULL,
  `classroom_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar`
--

LOCK TABLES `calendar` WRITE;
/*!40000 ALTER TABLE `calendar` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `calendar` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` text DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `shift` enum('Mañana','Tarde','Ambos') DEFAULT 'Mañana',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `classroom_id` bigint(20) DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `conversation_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/*!40000 ALTER TABLE `conversation` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `conversation` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `conversation_guardian`
--

DROP TABLE IF EXISTS `conversation_guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation_guardian` (
  `conversation_id` bigint(20) NOT NULL,
  `guardian_id` bigint(20) NOT NULL,
  PRIMARY KEY (`conversation_id`,`guardian_id`),
  KEY `guardian_id` (`guardian_id`),
  CONSTRAINT `conversation_guardian_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `conversation_guardian_ibfk_2` FOREIGN KEY (`guardian_id`) REFERENCES `guardian` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation_guardian`
--

LOCK TABLES `conversation_guardian` WRITE;
/*!40000 ALTER TABLE `conversation_guardian` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `conversation_guardian` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `conversation_staff`
--

DROP TABLE IF EXISTS `conversation_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation_staff` (
  `conversation_id` bigint(20) NOT NULL,
  `staff_id` bigint(20) NOT NULL,
  PRIMARY KEY (`conversation_id`,`staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `conversation_staff_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `conversation_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation_staff`
--

LOCK TABLES `conversation_staff` WRITE;
/*!40000 ALTER TABLE `conversation_staff` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `conversation_staff` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `emergency_contact`
--

DROP TABLE IF EXISTS `emergency_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_contact` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `full_name` text DEFAULT NULL,
  `relationship` text DEFAULT NULL,
  `phone` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_contact`
--

LOCK TABLES `emergency_contact` WRITE;
/*!40000 ALTER TABLE `emergency_contact` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `emergency_contact` VALUES
(1,NULL,NULL,NULL),
(2,'Roberto González','Padre','02494-445678'),
(3,'Patricia Rodríguez','Madre','02494-334455'),
(4,'Miguel Fernández','Padre','02494-556677'),
(5,'Andrea López','Madre','02494-667788'),
(6,'Carlos Martínez','Padre','02494-778899'),
(7,'Silvia García','Madre','02494-889900'),
(8,'Juan Sánchez','Padre','02494-990011'),
(9,'Mónica Díaz','Madre','02494-112233'),
(10,'Fernando Torres','Padre','02494-223344'),
(11,'Valeria Romero','Madre','02494-334466'),
(12,NULL,NULL,NULL),
(13,'Cecilia Morales','Madre','02494-556688'),
(14,'Pablo Ruiz','Padre','02494-667799'),
(15,'Natalia Suárez','Madre','02494-778800'),
(17,'dfsdf','tio','456654445');
/*!40000 ALTER TABLE `emergency_contact` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `guardian`
--

DROP TABLE IF EXISTS `guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `guardian` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` text DEFAULT NULL,
  `middle_name_optional` text DEFAULT NULL,
  `paternal_surname` text DEFAULT NULL,
  `maternal_surname` text DEFAULT NULL,
  `preferred_surname` text DEFAULT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `phone` text DEFAULT NULL,
  `email_optional` text DEFAULT NULL,
  `authorized_pickup` tinyint(1) DEFAULT NULL,
  `authorized_change` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `guardian_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian`
--

LOCK TABLES `guardian` WRITE;
/*!40000 ALTER TABLE `guardian` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `guardian` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `guardian_message`
--

DROP TABLE IF EXISTS `guardian_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `guardian_message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint(20) DEFAULT NULL,
  `sender_guardian_id` bigint(20) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `send_date` timestamp NULL DEFAULT NULL,
  `read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_guardian_id` (`sender_guardian_id`),
  CONSTRAINT `guardian_message_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `guardian_message_ibfk_2` FOREIGN KEY (`sender_guardian_id`) REFERENCES `guardian` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian_message`
--

LOCK TABLES `guardian_message` WRITE;
/*!40000 ALTER TABLE `guardian_message` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `guardian_message` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `parent_portal_submissions`
--

DROP TABLE IF EXISTS `parent_portal_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_portal_submissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `submitted_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_student_id` (`student_id`),
  CONSTRAINT `parent_portal_submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `parent_portal_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `parent_portal_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_portal_submissions`
--

LOCK TABLES `parent_portal_submissions` WRITE;
/*!40000 ALTER TABLE `parent_portal_submissions` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `parent_portal_submissions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `parent_portal_users`
--

DROP TABLE IF EXISTS `parent_portal_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_portal_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `google_id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `idx_google_id` (`google_id`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_portal_users`
--

LOCK TABLES `parent_portal_users` WRITE;
/*!40000 ALTER TABLE `parent_portal_users` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `parent_portal_users` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `parent_registration_drafts`
--

DROP TABLE IF EXISTS `parent_registration_drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_registration_drafts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `form_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`form_data`)),
  `current_step` int(11) NOT NULL DEFAULT 1,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_draft` (`user_id`),
  CONSTRAINT `parent_registration_drafts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `parent_portal_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_registration_drafts`
--

LOCK TABLES `parent_registration_drafts` WRITE;
/*!40000 ALTER TABLE `parent_registration_drafts` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `parent_registration_drafts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `permission_action`
--

DROP TABLE IF EXISTS `permission_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_action` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action_key` varchar(50) NOT NULL,
  `action_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `action_key` (`action_key`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_action`
--

LOCK TABLES `permission_action` WRITE;
/*!40000 ALTER TABLE `permission_action` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `permission_action` VALUES
(1,'ver','Ver','Visualizar información','2025-11-27 23:25:15'),
(2,'crear','Crear','Crear nuevos registros','2025-11-27 23:25:15'),
(3,'editar','Editar','Modificar registros existentes','2025-11-27 23:25:15'),
(4,'eliminar','Eliminar','Eliminar registros','2025-11-27 23:25:15'),
(5,'registrar','Registrar','Registrar eventos o acciones','2025-11-27 23:25:15'),
(6,'reportes','Reportes','Generar y visualizar reportes','2025-11-27 23:25:15'),
(7,'exportar','Exportar','Exportar datos a archivos','2025-11-27 23:25:15'),
(8,'enviar','Enviar','Enviar mensajes o notificaciones','2025-11-27 23:25:15'),
(9,'gestionar','Gestionar','Gestión completa del módulo','2025-11-27 23:25:15'),
(10,'modificar','Modificar','Modificar configuraciones','2025-11-27 23:25:15');
/*!40000 ALTER TABLE `permission_action` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `permission_audit_log`
--

DROP TABLE IF EXISTS `permission_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_audit_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) NOT NULL,
  `module_id` bigint(20) NOT NULL,
  `action_id` bigint(20) NOT NULL,
  `previous_value` tinyint(1) DEFAULT NULL,
  `new_value` tinyint(1) DEFAULT NULL,
  `changed_by` bigint(20) DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `module_id` (`module_id`),
  KEY `action_id` (`action_id`),
  KEY `idx_audit_log_changed_at` (`changed_at`),
  KEY `idx_audit_log_changed_by` (`changed_by`),
  CONSTRAINT `permission_audit_log_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `permission_audit_log_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `system_module` (`id`),
  CONSTRAINT `permission_audit_log_ibfk_3` FOREIGN KEY (`action_id`) REFERENCES `permission_action` (`id`),
  CONSTRAINT `permission_audit_log_ibfk_4` FOREIGN KEY (`changed_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_audit_log`
--

LOCK TABLES `permission_audit_log` WRITE;
/*!40000 ALTER TABLE `permission_audit_log` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `permission_audit_log` VALUES
(1,4,1,2,1,0,5,'2025-11-27 23:38:00','::1'),
(2,4,1,2,0,1,5,'2025-11-27 23:38:02','::1'),
(3,4,3,3,1,0,5,'2025-11-27 23:38:19','::1'),
(4,4,3,3,0,1,5,'2025-11-27 23:38:20','::1'),
(5,4,8,1,1,0,5,'2025-11-27 23:39:00','::1'),
(6,4,8,1,0,1,5,'2025-11-27 23:39:00','::1'),
(7,4,8,10,1,0,5,'2025-11-27 23:39:02','::1'),
(8,4,8,10,0,1,5,'2025-11-27 23:39:02','::1'),
(9,6,3,3,NULL,1,5,'2025-11-27 23:48:30','::1'),
(10,6,3,2,NULL,1,5,'2025-11-27 23:48:32','::1'),
(11,6,3,2,1,0,5,'2025-11-27 23:48:34','::1'),
(12,6,3,3,1,0,5,'2025-11-27 23:48:35','::1');
/*!40000 ALTER TABLE `permission_audit_log` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_name` text DEFAULT NULL,
  `access_level_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `access_level_id` (`access_level_id`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`access_level_id`) REFERENCES `access_level` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `role` VALUES
(4,'admin',1),
(5,'secretaria',2),
(6,'maestro',3),
(10,'directivo',4),
(11,'tutor',5);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) NOT NULL,
  `module_id` bigint(20) NOT NULL,
  `action_id` bigint(20) NOT NULL,
  `is_granted` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_permission` (`role_id`,`module_id`,`action_id`),
  KEY `updated_by` (`updated_by`),
  KEY `idx_role_permission_role` (`role_id`),
  KEY `idx_role_permission_module` (`module_id`),
  KEY `idx_role_permission_action` (`action_id`),
  CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `system_module` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permission_ibfk_3` FOREIGN KEY (`action_id`) REFERENCES `permission_action` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permission_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `role_permission` VALUES
(1,4,1,2,1,'2025-11-27 23:25:15','2025-11-27 23:38:02',5),
(2,4,5,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(3,4,8,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(4,4,7,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(5,4,3,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(6,4,6,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(7,4,2,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(8,4,4,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(9,4,1,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(10,4,5,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(11,4,8,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(12,4,7,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(13,4,3,3,1,'2025-11-27 23:25:15','2025-11-27 23:38:20',5),
(14,4,6,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(15,4,2,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(16,4,4,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(17,4,1,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(18,4,5,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(19,4,8,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(20,4,7,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(21,4,3,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(22,4,6,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(23,4,2,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(24,4,4,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(25,4,1,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(26,4,5,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(27,4,8,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(28,4,7,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(29,4,3,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(30,4,6,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(31,4,2,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(32,4,4,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(33,4,1,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(34,4,5,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(35,4,8,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(36,4,7,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(37,4,3,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(38,4,6,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(39,4,2,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(40,4,4,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(41,4,1,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(42,4,5,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(43,4,8,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(44,4,7,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(45,4,3,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(46,4,6,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(47,4,2,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(48,4,4,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(49,4,1,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(50,4,5,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(51,4,8,10,1,'2025-11-27 23:25:15','2025-11-27 23:39:02',5),
(52,4,7,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(53,4,3,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(54,4,6,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(55,4,2,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(56,4,4,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(57,4,1,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(58,4,5,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(59,4,8,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(60,4,7,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(61,4,3,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(62,4,6,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(63,4,2,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(64,4,4,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(65,4,1,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(66,4,5,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(67,4,8,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(68,4,7,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(69,4,3,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(70,4,6,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(71,4,2,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(72,4,4,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(73,4,1,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(74,4,5,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(75,4,8,1,1,'2025-11-27 23:25:15','2025-11-27 23:39:00',5),
(76,4,7,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(77,4,3,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(78,4,6,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(79,4,2,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(80,4,4,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(128,10,1,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(129,10,5,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(130,10,8,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(131,10,7,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(132,10,3,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(133,10,6,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(134,10,2,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(135,10,4,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(136,10,1,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(137,10,5,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(138,10,8,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(139,10,7,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(140,10,3,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(141,10,6,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(142,10,2,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(143,10,4,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(144,10,1,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(145,10,5,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(146,10,8,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(147,10,7,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(148,10,3,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(149,10,6,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(150,10,2,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(151,10,4,4,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(152,10,1,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(153,10,5,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(154,10,8,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(155,10,7,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(156,10,3,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(157,10,6,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(158,10,2,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(159,10,4,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(160,10,1,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(161,10,5,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(162,10,8,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(163,10,7,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(164,10,3,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(165,10,6,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(166,10,2,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(167,10,4,7,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(168,10,1,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(169,10,5,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(170,10,8,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(171,10,7,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(172,10,3,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(173,10,6,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(174,10,2,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(175,10,4,9,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(176,10,1,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(177,10,5,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(178,10,8,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(179,10,7,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(180,10,3,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(181,10,6,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(182,10,2,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(183,10,4,10,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(184,10,1,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(185,10,5,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(186,10,8,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(187,10,7,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(188,10,3,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(189,10,6,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(190,10,2,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(191,10,4,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(192,10,1,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(193,10,5,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(194,10,8,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(195,10,7,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(196,10,3,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(197,10,6,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(198,10,2,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(199,10,4,6,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(200,10,1,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(201,10,5,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(202,10,8,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(203,10,7,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(204,10,3,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(205,10,6,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(206,10,2,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(207,10,4,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(255,5,1,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(256,5,1,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(257,5,1,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(258,5,5,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(259,5,5,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(260,5,5,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(261,5,7,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(262,5,7,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(263,5,3,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(264,5,6,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(265,5,2,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(266,5,4,2,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(267,5,4,3,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(268,5,4,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(270,6,1,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(271,6,5,5,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(272,6,5,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(273,6,7,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(274,6,7,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(275,6,3,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(276,6,6,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(277,6,2,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(278,6,4,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(285,11,1,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(286,11,5,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(287,11,7,8,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(288,11,7,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(289,11,2,1,1,'2025-11-27 23:25:15','2025-11-27 23:25:15',NULL),
(300,6,3,3,0,'2025-11-27 23:48:30','2025-11-27 23:48:35',5),
(301,6,3,2,0,'2025-11-27 23:48:32','2025-11-27 23:48:34',5);
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` text DEFAULT NULL,
  `middle_name_optional` text DEFAULT NULL,
  `third_name_optional` text DEFAULT NULL,
  `paternal_surname` text DEFAULT NULL,
  `maternal_surname` text DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `phone` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_optional` text DEFAULT NULL,
  `classroom_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `dni` (`dni`),
  KEY `address_id` (`address_id`),
  KEY `classroom_id` (`classroom_id`),
  KEY `role_id` (`role_id`),
  KEY `idx_staff_email` (`email`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`),
  CONSTRAINT `staff_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `staff` VALUES
(5,'Administrador',NULL,NULL,'Sistema','Principal','12345678',NULL,'123456789','admin@jardin.com','$2b$10$Njyj3cuZ4NuCHCKGYlKEjOQsPLHPf26Y/bjgp/DLT/L/54dJfR5pS',1,NULL,NULL,4,'2025-11-27 22:51:27','2025-11-28 04:08:22');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `staff_message`
--

DROP TABLE IF EXISTS `staff_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint(20) DEFAULT NULL,
  `sender_staff_id` bigint(20) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `send_date` timestamp NULL DEFAULT NULL,
  `read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_staff_id` (`sender_staff_id`),
  CONSTRAINT `staff_message_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `staff_message_ibfk_2` FOREIGN KEY (`sender_staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_message`
--

LOCK TABLES `staff_message` WRITE;
/*!40000 ALTER TABLE `staff_message` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `staff_message` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` text DEFAULT NULL,
  `middle_name_optional` text DEFAULT NULL,
  `third_name_optional` text DEFAULT NULL,
  `paternal_surname` text DEFAULT NULL,
  `maternal_surname` text DEFAULT NULL,
  `nickname_optional` text DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `emergency_contact_id` bigint(20) DEFAULT NULL,
  `classroom_id` bigint(20) DEFAULT NULL,
  `shift` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `address_id` (`address_id`),
  KEY `emergency_contact_id` (`emergency_contact_id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`emergency_contact_id`) REFERENCES `emergency_contact` (`id`),
  CONSTRAINT `student_ibfk_3` FOREIGN KEY (`classroom_id`) REFERENCES `classroom` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `student_guardian`
--

DROP TABLE IF EXISTS `student_guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_guardian` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) NOT NULL,
  `guardian_id` bigint(20) NOT NULL,
  `relationship` varchar(50) NOT NULL COMMENT 'Padre, Madre, Tutor, Abuelo/a, Tío/a, etc',
  `is_primary` tinyint(1) DEFAULT 0 COMMENT 'Si es el responsable principal',
  `authorized_pickup` tinyint(1) DEFAULT 0 COMMENT 'Autorizado para retirar al niño',
  `authorized_diaper_change` tinyint(1) DEFAULT 0 COMMENT 'Autorizado para cambiar pañales',
  `notes` text DEFAULT NULL COMMENT 'Notas adicionales sobre este responsable',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_guardian` (`student_id`,`guardian_id`),
  KEY `idx_student_guardian_student` (`student_id`),
  KEY `idx_student_guardian_guardian` (`guardian_id`),
  KEY `idx_student_guardian_primary` (`is_primary`),
  CONSTRAINT `student_guardian_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_guardian_ibfk_2` FOREIGN KEY (`guardian_id`) REFERENCES `guardian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_guardian`
--

LOCK TABLES `student_guardian` WRITE;
/*!40000 ALTER TABLE `student_guardian` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `student_guardian` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `system_module`
--

DROP TABLE IF EXISTS `system_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_module` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `module_key` varchar(50) NOT NULL,
  `module_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_key` (`module_key`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_module`
--

LOCK TABLES `system_module` WRITE;
/*!40000 ALTER TABLE `system_module` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `system_module` VALUES
(1,'alumnos','Gestión de Alumnos','Administración completa de alumnos del jardín','school',1,1,'2025-11-27 23:25:15'),
(2,'salas','Gestión de Salas','Administración de aulas y capacidad','meeting_room',1,2,'2025-11-27 23:25:15'),
(3,'personal','Gestión de Personal','Administración de staff del jardín','badge',1,3,'2025-11-27 23:25:15'),
(4,'tutores','Gestión de Tutores','Administración de padres y tutores','supervisor_account',1,4,'2025-11-27 23:25:15'),
(5,'asistencia','Control de Asistencia','Registro y seguimiento de asistencia','fact_check',1,5,'2025-11-27 23:25:15'),
(6,'reportes','Reportes y Estadísticas','Generación de reportes e informes','assessment',1,6,'2025-11-27 23:25:15'),
(7,'mensajeria','Sistema de Mensajería','Comunicación interna del jardín','forum',1,7,'2025-11-27 23:25:15'),
(8,'configuracion','Configuración del Sistema','Configuración general y permisos','settings',1,8,'2025-11-27 23:25:15');
/*!40000 ALTER TABLE `system_module` ENABLE KEYS */;
UNLOCK TABLES;
commit;

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
  1 AS `module_key`,
  1 AS `module_name`,
  1 AS `action_id`,
  1 AS `action_key`,
  1 AS `action_name`,
  1 AS `has_permission`,
  1 AS `updated_at`,
  1 AS `updated_by_first_name`,
  1 AS `updated_by_surname` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_student_guardians`
--

DROP TABLE IF EXISTS `v_student_guardians`;
/*!50001 DROP VIEW IF EXISTS `v_student_guardians`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_student_guardians` AS SELECT
 1 AS `student_id`,
  1 AS `student_first_name`,
  1 AS `student_paternal_surname`,
  1 AS `relation_id`,
  1 AS `relationship`,
  1 AS `is_primary`,
  1 AS `authorized_pickup`,
  1 AS `authorized_diaper_change`,
  1 AS `notes`,
  1 AS `guardian_id`,
  1 AS `guardian_first_name`,
  1 AS `guardian_paternal_surname`,
  1 AS `guardian_maternal_surname`,
  1 AS `guardian_phone`,
  1 AS `guardian_email`,
  1 AS `guardian_authorized_pickup`,
  1 AS `guardian_authorized_change` */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_role_permissions`
--

/*!50001 DROP VIEW IF EXISTS `v_role_permissions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_role_permissions` AS select `r`.`id` AS `role_id`,`r`.`role_name` AS `role_name`,`m`.`id` AS `module_id`,`m`.`module_key` AS `module_key`,`m`.`module_name` AS `module_name`,`a`.`id` AS `action_id`,`a`.`action_key` AS `action_key`,`a`.`action_name` AS `action_name`,coalesce(`rp`.`is_granted`,0) AS `has_permission`,`rp`.`updated_at` AS `updated_at`,`s`.`first_name` AS `updated_by_first_name`,`s`.`paternal_surname` AS `updated_by_surname` from ((((`role` `r` join `system_module` `m`) join `permission_action` `a`) left join `role_permission` `rp` on(`rp`.`role_id` = `r`.`id` and `rp`.`module_id` = `m`.`id` and `rp`.`action_id` = `a`.`id`)) left join `staff` `s` on(`rp`.`updated_by` = `s`.`id`)) where `m`.`is_active` = 1 order by `r`.`id`,`m`.`display_order`,`a`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_student_guardians`
--

/*!50001 DROP VIEW IF EXISTS `v_student_guardians`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_student_guardians` AS select `s`.`id` AS `student_id`,`s`.`first_name` AS `student_first_name`,`s`.`paternal_surname` AS `student_paternal_surname`,`sg`.`id` AS `relation_id`,`sg`.`relationship` AS `relationship`,`sg`.`is_primary` AS `is_primary`,`sg`.`authorized_pickup` AS `authorized_pickup`,`sg`.`authorized_diaper_change` AS `authorized_diaper_change`,`sg`.`notes` AS `notes`,`g`.`id` AS `guardian_id`,`g`.`first_name` AS `guardian_first_name`,`g`.`paternal_surname` AS `guardian_paternal_surname`,`g`.`maternal_surname` AS `guardian_maternal_surname`,`g`.`phone` AS `guardian_phone`,`g`.`email_optional` AS `guardian_email`,`g`.`authorized_pickup` AS `guardian_authorized_pickup`,`g`.`authorized_change` AS `guardian_authorized_change` from ((`student` `s` join `student_guardian` `sg` on(`s`.`id` = `sg`.`student_id`)) join `guardian` `g` on(`sg`.`guardian_id` = `g`.`id`)) order by `s`.`paternal_surname`,`s`.`first_name`,`sg`.`is_primary` desc */;
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
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-11-28  7:12:34
