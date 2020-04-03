#!/bin/bash
# author: wct fxy
check()
{
    if (($(ps aux|grep manage.py|grep -v grep|wc -l) == 0));then
        # stopped
        return 1;
    else
        # running
        return 0;
    fi
}

start()
{
    check
    if (($? == 1));then
        echo -n 'flask server to start......'
        path=$(dirname $0)
        if [[ $path != '.' ]];then
            cd $path
        fi
        nohup /home/seemmo/share/python/centos/python3.6.6/bin/python3 manage.py runserver -h "0.0.0.0" -p 5000 >nohup.out 2>&1 &
        # nohup python3 # python3 manage.py runserver -h "127.0.0.1" -p 5000 >nohup.out 2>&1 &
        while true
        do
            check
            if (($? == 1));then
                echo -n '...'
                sleep 1
            else
                echo -e '\033[32mstarted\033[1m\033[0m'
                break
            fi
        done
    else
        echo "flask server has been running!!!"
    fi
}

fstop()
{
    check
    if (($? == 1));then
        echo "flask server has been stopped!!!"
    else
        echo -n 'flask server force to stop.....'
        ps aux|grep manage.py|grep -v grep|awk '{print $2}'|xargs kill -9
        while true
        do
            check
            if (($? == 1));then
                echo -e '\033[32mstopped\033[1m\033[0m'
                break
            else
                echo -n '...'
                sleep 1
            fi
        done
    fi
}

stop()
{
    check
    if (($? == 1));then
        echo "flask server has been stopped!!!"
    else
        echo -n 'flask server to stop.....'
        spid=1
        tp_list=($(ps aux|grep manage.py|grep -v grep|awk '{print $2}'|xargs))
        for tpid in ${tp_list[@]}
        do
            if ((spid == 1));then
                spid=$tpid
            elif ((tpid < spid));then
                spid=$tpid
            fi
        done
        kill -15 $spid
        retry_time=30
        while true
        do
            if ((retry_time == 0));then
                echo
                fstop
                break
            fi
            check
            if (($? == 1));then
                echo -e '\033[32mstopped\033[1m\033[0m'
                break
            else
                ((retry_time=retry_time-1))
                echo -n '.'
                sleep 1
            fi
        done
    fi
}

status()
{
    check
    if (($? == 1));then
        echo -e 'flask server now is \033[32mstopped\033[1m\033[0m'
    else
        echo -e 'flask server now is \033[32mrunning\033[1m\033[0m'
    fi
}

restart() {
    check
    if (($? == 1));then
        start
    else
        stop
        while true
        do
            check
            if (($? == 1));then
                start
                break
            else
                sleep 1
            fi
        done
    fi
}

if (($# == 1));then
    case $1 in
        start|stop|status|restart|fstop)
            $1
            ;;
        *)
            echo "Usage: bash $0 {start|stop|status|restart|fstop}"
            exit 2
    esac
else
    echo "Usage: bash $0 {start|stop|status|restart|fstop}"
    exit 2
fi
