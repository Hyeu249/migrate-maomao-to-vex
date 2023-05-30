FROM mariadb:10.4.19

RUN echo "innodb_strict_mode=0" >> /etc/mysql/mariadb.cnf
RUN echo "innodb_log_file_size=512M" >> /etc/mysql/mariadb.cnf
RUN echo "innodb_log_buffer_size=512M" >> /etc/mysql/mariadb.cnf