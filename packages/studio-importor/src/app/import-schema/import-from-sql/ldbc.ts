export default `
CREATE DATABASE IF NOT EXISTS ldbc;
USE ldbc;

CREATE TABLE organisation (
            org_id BIGINT NOT NULL,
            org_type VARCHAR(255),
            org_name TEXT,
            org_url TEXT,
            PRIMARY KEY (org_id)
        );
        
CREATE TABLE place (
            pla_id BIGINT NOT NULL,
            pla_name TEXT,
            pla_url TEXT,
            pla_type VARCHAR(255),
            PRIMARY KEY (pla_id)
        );
CREATE TABLE tag (
            tag_id BIGINT NOT NULL,
            tag_name TEXT,
            tag_url TEXT,
            PRIMARY KEY (tag_id)
        );
CREATE TABLE tagclass (
            tagc_id BIGINT NOT NULL,
            tagc_name TEXT,
            tagc_url TEXT,
            PRIMARY KEY (tagc_id)
        );
CREATE TABLE person (
            p_id BIGINT NOT NULL,
            p_first_name VARCHAR(255),
            p_last_name VARCHAR(255),
            p_gender VARCHAR(255),
            p_birthday VARCHAR(255),
            p_creation_date VARCHAR(255),
            p_location_ip VARCHAR(255),
            p_browser_used VARCHAR(255),
            PRIMARY KEY (p_id)
        );
CREATE TABLE comment (
            co_id BIGINT NOT NULL,
            co_creation_date VARCHAR(255),
            co_location_ip VARCHAR(255),
            co_browser_used VARCHAR(255),
            co_content TEXT,
            co_length INT,
            PRIMARY KEY (co_id)
        );
CREATE TABLE post (
            po_id BIGINT NOT NULL,
            po_image_file VARCHAR(255),
            po_creation_date VARCHAR(255),
            po_location_ip VARCHAR(255),
            po_browser_used VARCHAR(255),
            po_language VARCHAR(255),
            po_content TEXT,
            po_length INT,
            PRIMARY KEY (po_id)
        );
CREATE TABLE forum (
            fo_id BIGINT NOT NULL,
            fo_title TEXT,
            fo_creation_date VARCHAR(255),
            PRIMARY KEY (fo_id)
        );
CREATE TABLE org_islocationin (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES organisation(org_id),
            FOREIGN KEY (dst) REFERENCES place(pla_id)
        );
CREATE TABLE ispartof (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES place(pla_id),
            FOREIGN KEY (dst) REFERENCES place(pla_id)
        );
CREATE TABLE issubclassof (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES tagclass(tagc_id),
            FOREIGN KEY (dst) REFERENCES tagclass(tagc_id)
        );
CREATE TABLE hastype (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES tag(tag_id),
            FOREIGN KEY (dst) REFERENCES tagclass(tagc_id)
        );
CREATE TABLE comment_hascreator (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES comment(co_id),
            FOREIGN KEY (dst) REFERENCES person(p_id)
        );
CREATE TABLE comment_hastag (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES comment(co_id),
            FOREIGN KEY (dst) REFERENCES tag(tag_id)
        );
CREATE TABLE comment_islocationin (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES comment(co_id),
            FOREIGN KEY (dst) REFERENCES place(pla_id)
        );
CREATE TABLE replyof_comment (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES comment(co_id),
            FOREIGN KEY (dst) REFERENCES comment(co_id)
        );
CREATE TABLE replyof_post (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES comment(co_id),
            FOREIGN KEY (dst) REFERENCES post(po_id)
        );
CREATE TABLE post_hascreator (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES post(po_id),
            FOREIGN KEY (dst) REFERENCES person(p_id)
        );
CREATE TABLE post_hastag (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES post(po_id),
            FOREIGN KEY (dst) REFERENCES tag(tag_id)
        );
CREATE TABLE post_islocationin (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES post(po_id),
            FOREIGN KEY (dst) REFERENCES place(pla_id)
        );
CREATE TABLE forum_containerof (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES forum(fo_id),
            FOREIGN KEY (dst) REFERENCES post(po_id)
        );
CREATE TABLE forum_hasmoderator (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES forum(fo_id),
            FOREIGN KEY (dst) REFERENCES person(p_id)
        );
CREATE TABLE forum_hastag (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES forum(fo_id),
            FOREIGN KEY (dst) REFERENCES tag(tag_id)
        );
CREATE TABLE person_hasinterest (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES person(p_id),
            FOREIGN KEY (dst) REFERENCES tag(tag_id)
        );
CREATE TABLE person_islocationin (
            src BIGINT,
            dst BIGINT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES person(p_id),
            FOREIGN KEY (dst) REFERENCES place(pla_id)
        );
CREATE TABLE forum_hasmember (
            src BIGINT,
            dst BIGINT,
            fo_hm_join_date VARCHAR(255),
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES forum(fo_id),
            FOREIGN KEY (dst) REFERENCES person(p_id)
        );
CREATE TABLE knows (
            src BIGINT,
            dst BIGINT,
            kn_creation_date VARCHAR(255),
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES person(p_id),
            FOREIGN KEY (dst) REFERENCES person(p_id)
        );
CREATE TABLE likes_comment (
            src BIGINT,
            dst BIGINT,
            likes_co_creation_date VARCHAR(255),
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES person(p_id),
            FOREIGN KEY (dst) REFERENCES comment(co_id)
        );
CREATE TABLE likes_post (
            src BIGINT,
            dst BIGINT,
            likes_po_creation_date VARCHAR(255),
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES person(p_id),
            FOREIGN KEY (dst) REFERENCES post(po_id)
        );
CREATE TABLE studyat (
            src BIGINT,
            dst BIGINT,
            sa_class_year INT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES person(p_id),
            FOREIGN KEY (dst) REFERENCES organisation(org_id)
        );
CREATE TABLE workat (
            src BIGINT,
            dst BIGINT,
            wa_work_from INT,
            PRIMARY KEY (src, dst),
            FOREIGN KEY (src) REFERENCES person(p_id),
            FOREIGN KEY (dst) REFERENCES organisation(org_id)
        );
`;
