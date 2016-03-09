#include <cstdio>
#include <iostream>
#include <cstdlib>
#include <unistd.h>
#include <sys/types.h>
using namespace std;
//目前docker镜像中uid,gid均为1001
#define UID 1001
#define GID 1001
int main(){
	setuid(UID);
	setgid(GID);
	int pid = fork();
	if (pid > 0){
		cout<<pid<<endl;
		return 0;
	}
	system("/data/service/java_start.sh");
	return 0;
}
