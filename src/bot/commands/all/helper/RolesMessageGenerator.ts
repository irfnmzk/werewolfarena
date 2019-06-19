import * as line from '@line/bot-sdk';

export function rolesMessage(): line.Message {
  return {
    type: 'imagemap',
    baseUrl: `${process.env.BASE_URL!}/static/imagemap/roles`,
    altText: `Roles`,
    baseSize: {
      width: 1040,
      height: 1040
    },
    actions: [
      {
        area: {
          x: 0,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info werewolf'
      },
      {
        area: {
          x: 346,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info villager'
      },
      {
        area: {
          x: 692,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info guardian'
      },
      {
        area: {
          x: 0,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info seer'
      },
      {
        area: {
          x: 346,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info drunk'
      },
      {
        area: {
          x: 692,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info fool'
      },
      {
        area: {
          x: 692,
          y: 780,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/roles 2'
      }
    ]
  };
}

export function rolesMessage2(): line.Message {
  return {
    type: 'imagemap',
    baseUrl: `${process.env.BASE_URL!}/static/imagemap/roles_2`,
    altText: `Roles`,
    baseSize: {
      width: 1040,
      height: 1040
    },
    actions: [
      {
        area: {
          x: 0,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info cursed'
      },
      {
        area: {
          x: 346,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info harlot'
      },
      {
        area: {
          x: 692,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info lumberjack'
      },
      {
        area: {
          x: 0,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info traitor'
      },
      {
        area: {
          x: 346,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info hunter'
      },
      {
        area: {
          x: 692,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info gunner'
      },
      {
        area: {
          x: 0,
          y: 780,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/roles'
      },
      {
        area: {
          x: 692,
          y: 780,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/roles 3'
      }
    ]
  };
}

export function rolesMessage3(): line.Message {
  return {
    type: 'imagemap',
    baseUrl: `${process.env.BASE_URL!}/static/imagemap/roles_3`,
    altText: `Roles`,
    baseSize: {
      width: 1040,
      height: 1040
    },
    actions: [
      {
        area: {
          x: 0,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info doctor'
      },
      {
        area: {
          x: 346,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info lycan'
      },
      {
        area: {
          x: 692,
          y: 260,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info wolfman'
      },
      {
        area: {
          x: 0,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info beholder'
      },
      {
        area: {
          x: 346,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info tanner'
      },
      {
        area: {
          x: 692,
          y: 520,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/info princess'
      },
      {
        area: {
          x: 0,
          y: 780,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/roles 2'
      },
      {
        area: {
          x: 692,
          y: 780,
          width: 346,
          height: 260
        },
        type: 'message',
        text: '/roles 4'
      }
    ]
  };
}
