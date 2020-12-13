# NestJS Demo

## I like Nest because...

It's not plain Express. What happens with every express project is someone decides to implement their own IoC manually and clunkily, and sharing services becomes harder and harder. The routing is customization paradise for every clever person out there. It's always something unique and insane.

What's nice about Nest is it takes patterns and uses its opinionated framework approach to unify the way a Node app should be structured.

## Install

You'll want to have `node` and maybe `yarn` on your machines. Use `brew` if you like.

## Setup

To get the nest cli:

```
yarn global add @nestjs/cli
yarn global add @nestjs/schematics
```

There's some quirk of using nest with `yarn` and its global system that you need both of these. If you go the `npm` global way, you might only need the first package.

## New project

```
nest new nestjs-demo
```

This will ask you some questions, like if you want `npm` or `yarn`. I'm going to pick `yarn`, but you can use either.

## Let's get it running

```
cd nestjs-demo
yarn start
```

Let's visit our friends http://localhost:3000/

We should see:

> Hello World!

## Overview of all these files

In the root level, there's some config files.

In the `src`, there's `main.ts`, our entry point.

We have some familiar friends:

* `app.service.ts`
* `app.controller.ts`

The `app.module.ts` is the root module in the Nest IoC _service container_. Usually I think of service containers being more of a hash map, but in Nest, it is more like a tree.

## Let's change stuff

Let's begin with the API that we just hit, the root.

First up, let's open the `app.controller.ts` and see if we can make some changes.

Looks like we have a service, so let's edit that instead.

Opening up `app.service.ts`, we found _Hello World_. Let's change it to _Hello Roxy!_

Why didn't anything happen? We didn't run `nest` in watch mode.

In your `nest` terminal, _ctrl+c_ to stop it, then:

```
yarn start:dev
```

Now, anytime we make changes and save, it will automatically restart the server for us.

Let's change it to _Hello Roxy the dog!_ It should reload.

Let's returning something more interesting.

## Let's do something sort of novel

With our CLI, I'll make a new service for `app.service.ts` to call.

```
nest g service Health
```

This will make a service in a folder.

Then we can also make a class too.

```
nest g class health/Health
```

Ok, here we go.

Here's the content for the service:

```ts
import { Injectable } from '@nestjs/common';
import { cpus } from 'os';
import { Health } from './health';

@Injectable()
export class HealthService {
  public getHealth() {
    const health: Health = {
      project: 'NestJS Demo 🎉',
      authors: ['Ryan'],
      usage: this.getCpuUsage(),
      uptime: this.getUptime(),
      time: Date.now(),
    };

    return health;
  }

  private getCpuUsage() {
    return cpus()
      .map((c) => c.times.user)
      .reduce((a, b) => a + b, 0);
  }

  private getUptime() {
    return process.uptime();
  }
}

```

And here's the Health class.

```ts
export class Health {
  project: string;
  authors: string[];
  usage: number;
  uptime: number;
  time: number;
}
```

Back in `app.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { Health } from './health/health';
import { HealthService } from './health/health.service';

@Injectable()
export class AppService {
  constructor(private readonly healthService: HealthService) {}

  getHello(): Health {
    return this.healthService.getHealth();
  }
}
```

We also need to change the return type in the controller.

```ts
  @Get()
  getHello(): Health {
    return this.appService.getHello();
  }
```

After a reload, if we did it all right, we should get this:

```json
{
    "project": "NestJS Demo 🎉",
    "authors": ["Ryan"],
    "usage": 43457770,
    "uptime": 25.6986415,
    "time": 1607820710265
}
```

## Bonus materials 

We're going to run out of time here, but I wanted to make the CPU usage more interesting, and finish writing our tests.

Something that JavaScript can do better than Java is isolating _logic_. That is, instead of needing dozen of classes and services, we can just put functions in a file and then import them as we need. If those functions end up pure, as in, _data goes in, data comes out_, then testing them ends up much easier usually.

Let's put a big'ol'chunk of code into a `health.util.spec.ts` and of course create its associated `.spec`.

```ts
import { CpuInfo } from 'os';

type KeyTypes = keyof CpuInfo['times'];
type KeyedRecored = Record<KeyTypes, number>;

function getKeys(cpus: CpuInfo[]) {
  return Object.keys(cpus[0].times);
}

export function computeUsage(cpus: CpuInfo[]) {
  const keys = getKeys(cpus);
  let total = 0;

  const totals: KeyedRecored = keys
    .map((k) => ({ [k]: 0 } as KeyedRecored))
    .reduce((a, b) => ({ ...a, ...b }), {}) as KeyedRecored;

  for (const cpu of cpus) {
    for (const key of keys) {
      const time = cpu.times[key];
      total += time;
      totals[key] += time;
    }
  }

  const results = keys
    .map((k) => ({ [k]: Math.round((totals[k] / total) * 10000) / 100 }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  const result: KeyedRecored = {
    ...results,
  } as KeyedRecored;

  return result;
}
```

The spec looks like:

```ts
import { CpuInfo } from 'os';
import { computeUsage } from './health.util';

describe('health util', () => {
  it('should compute usage', () => {
    const cpus: CpuInfo[] = [
      {
        model: 'processor',
        speed: 24,
        times: { user: 8285130, nice: 0, sys: 5109250, idle: 45425440, irq: 0 },
      },
      {
        model: 'processor',
        speed: 24,
        times: { user: 7834230, nice: 0, sys: 4626940, idle: 46354800, irq: 0 },
      },
    ];

    const result = computeUsage(cpus);

    expect(result.user).toEqual(13.7);
  });
});
```

The best mocks are the ones that never happen.

Since this code is also powered of off a builtin node package, what, are you going to really mock it? If it does not work, you have _way bigger problems_.

Since we're looking at tests now, we'll notice that our `app.controller.spec.ts` doesn't work. It complains about not finding a service.

```ts
const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, HealthService],
    }).compile();
```

We need to add the `HealthService` here, because unlike Java and Spring with loads of reflection, we need to do it manually. It's a bummer, but it's OK.

## The End?

Nest has an extraordinary amount of breadth. It's very much like Spring/Boot.

Go read more and have fun.