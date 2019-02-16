import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import { getCommandListMessage } from './helper/TutorialMessageGenerator';

export default class ListCommand extends Command {
  private commands: { name: string; desc: string }[];

  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/commands'];
    this.commands = [
      { name: '/buat', desc: 'Membuat game baru' },
      { name: '/join', desc: 'Bergabung ke dalam game' },
      { name: '/batal', desc: 'Membatalkan game yang belum di mulai' },
      { name: '/mulai', desc: 'Memulai game yang sudah di buat' },
      { name: '/pemain', desc: 'Melihat daftar pemain' },
      { name: '/pengaturan', desc: 'Merubah pengaturan grup' },
      {
        name: '/notify',
        desc: 'Memberi notifikasi bila game selanjutnya di mulai'
      },
      { name: '/stats', desc: 'Melihat statistik grup' },
      { name: '/versi', desc: 'Melihat versi game saat ini' },
      { name: '/about', desc: 'Melihat tentang game' },
      { name: '/tutorial', desc: 'Melihat tutorial' },
      { name: '/roles', desc: 'Melihat daftar peran' }
    ];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: any, source: MessageSource) {
    return this.channel.replyWithAny(
      source.replyToken!,
      getCommandListMessage(this.commands)
    );
  }
}
