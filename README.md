# processes

How do we handle node processes?

## Motivation

When thinking about authoring & deploying node applications some
  questions come to mind

> How do you manage multiple node applications?

> How do you cluster multiple node applications?

> How do you monitor the status of your node application?

> How do you monitor the status of your cluster?

> How do you deploy your node applications?

## Monitoring

What does monitoring mean. Monitoring means we want to be able
  to answer questions about a system. It also means we want to
  observe a system over time.

There are existing tools to be able to answer certain types of
  questions. If you want to know the runtime behaviour of a 
  certain process you can use dtrace.

If you want to monitor activity of various metrics of a process
  over a period of time you can use tools like [nodetime](http://nodetime.com/)

There are some outstanding questions

> What do you want to know about your process at run time?

This basically drives how you will approach monitoring. This question
  is generally specific to your needs.

> What do you want to be able to ask your processes on demand

If you can't already ask it with dtrace add dtrace hooks to your
  node processes using the dtrace provider.

> What do you want to monitor over time about processes

If nodetime doesn't have what you want to know consider tracking
  it yourself or see whether other analytics services provide it

## Deployment

There are many strategies to deployment. I can't tell you how to
  deploy, it really depends on your concerns

> Should deployment be a simple process to reduce complexity ?

> Do you need to be able to one click deploy from anywhere ?

> Should your deploy start your application multiple times for
  availability and fault tolerance?

> Should your deploy process be coupled to your process for 
  starting and stopping applications

> Should your deploy process be fully automated based on your
  code repositories.

> Should you use continuous deployment?

> Should the process of starting and stopping applications be
  coupled to them being available publically via your proxy / 
  load balancer.

> Do you want to be able to deploy the same application under 
  multiple versions?

> Do you want to be able to run the same application at multiple
  versions?

There are many other questions. You should look at what you need
  before you think about building something.

## Spawning applications

You need a solid strategy for how to start deployed applications and
  how to ensure that they are up and stay up.

Generally you can use some kind of tool that restarts processes or
  services when they go down. For example [forever](https://github.com/nodejitsu/forever) or whatever the system default is for your OS.

## Clustering

Clustering is used to run multiple versions of the same process
  as a single unit. This gives you increased performance on a
  multi core machine and it gives you availability. As long
  as not all of your workers in the cluster crash at once you
  will have availability

Your needs for clustering is also based on various questions

> Should all processes in a cluster live on the same physical
  machine?

Ideally yes. This increases performance and makes the clustering
  technique better. The general technique is to have a master 
  process with some named pipes to child proceses. The master 
  process starts a TCP / HTTP server and distributes the sockets
  to the child processes over the named pipe.

The way the sockets get distributed is by just passing the handle
  around which is significantly more efficient then proxying.

Now obvouisly if your clustering for availability then you can't
  put all your nodes on a central point of failure.

This means you should run multiple clusters per application. However
  what do you call a cluster of clusters? How do you want to 
  manage a cluster of clusters as a cohesive unit or as seperate
  units?

> How does your cluster of applications interact with the load
  balancer.

This depends on your load balancer configuration. Generally you want
  some kind of central service that knows about all applications and
  their locations. The load balancer can then talk to it to make sure
  that the load balancing table is upto date.

> Should a crashed process in a cluster automatically restart.
  If it keeps crashing how do you want to handle that process?

Deciding what a sensible default is, is difficult. Generally you want
  the cluster to restart a process. However if it keeps crashing you
  may want to apply some kind of exponential backoff.

> Do you want to have a zero down time restart of a cluster?

This is useful but might not be worth the complexity.

> Do workers in a cluster need to communicate to each other or
  somehow co-ordinate outside of having the server requests be
  distributed to them evenly.

You want to avoid having workers communicate with each other. They
  will need to communicate with the master to handle graceful shutdown
  but that's about it.

Any communication across processes should go over your cross process
  communication channel. Whether that is a shared database like redis
  or just a TCP / HTTP protocol.

> Should a cluster dynamically resize itself based on load?
  if you do resizing you will eventually have to provision new
  machines as there is a limit.

This would be a nice feature. However it only works within the 
  bounds of your machines limits unless you have a mechanism for
  spawning new machines dynamically or your a PaaS that will auto
  scale your machine transparently.

If we assume auto scaling then the master process can monitor
  idle time and scale the number of workers dynamically.

## Installation

`npm install processes`

## Contributors

 - Raynos

## MIT Licenced
