#!/bin/bash

#nginx log
log_path="/data/log/nginx/"
pid_path="/usr/local/nginx/logs/nginx.pid"

mv ${log_path}access.log ${log_path}access_$(date -d "yesterday" +"%Y%m%d").log
mv ${log_path}error.log ${log_path}error_$(date -d "yesterday" +"%Y%m%d").log

kill -USR1 `cat ${pid_path}`



#service log
service_log_path="/data/log/service/"


cp ${service_log_path}PakReportFormService.log ${service_log_path}PakReportFormService_$(date -d "yesterday" +"%Y%m%d").log
cat /dev/null > ${service_log_path}PakReportFormService.log
