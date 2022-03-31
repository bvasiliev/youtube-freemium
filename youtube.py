import youtube_dl
import re


class YoutubeLogger(object):
    """ Log YouTube errors to stdout """
    def debug(self, msg):
        pass

    def warning(self, msg):
        pass

    @staticmethod
    def error(msg):
        print(msg)


YOUTUBE_OPTIONS = {
    'format': '140',
    'simulate': True,
    'quiet': True,
    'socket-timeout': 5,
    'logger': YoutubeLogger(),
    }

YOUTUBE_RE = re.compile(
    r'^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$',
    re.I)

downloader = youtube_dl.YoutubeDL(YOUTUBE_OPTIONS)


class Video(object):
    def __init__(self, request_url):
        self.info = None
        if YOUTUBE_RE.match(request_url):
            try:
                self.info = self.__get_video_info__(request_url)

                """for key, value in yt_info.items():
                    setattr(self, key, value)"""

            except youtube_dl.utils.DownloadError:
                pass

        if self.info:
            self.__update_artwork__()

    @staticmethod
    def __get_video_info__(url):
        with downloader:
            result = downloader.extract_info(url)
        return result

    def __update_artwork__(self):
        """ YouTube thumbnails list to MediaSession api artwork list """
        art_id = 0
        self.info['artwork'] = list()
        for thumbnail in self.info['thumbnails']:
            artwork = {'src': thumbnail['url'],
                       'sizes': thumbnail['resolution'],
                       'type': 'image/jpg',
                       'id': art_id
                       }
            self.info['artwork'].append(artwork)
            art_id += 1
