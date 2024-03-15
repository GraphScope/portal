import { IApi } from 'umi';

const args = process.argv.slice(2);

// 解析参数
const params: Record<string, any> = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  //@ts-ignore
  params[key.slice(2)] = value;
});
export default (api: IApi) => {
  api.modifyHTML($ => {
    $('head').append([
      `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style type='text/css'>
       html,body,#root{
        height:100vh
       }
      </style>
      <script>
       window.GS_ENGINE_TYPE="${params.engineType}";
       window.GS_GREMLIN= {};
      </script>
      `,
    ]);
    return $;
  });
};
