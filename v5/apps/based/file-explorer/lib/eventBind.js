export default function eventBind() {

  // when click .upload-files, dynamically create input with directory support and click it
  // take the results and send them to handleDrop
  $('.upload-files').on('click', async (e) => {
    // console.log('upload files clicked');
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = false;
    input.directory = false;
    input.click();

    input.onchange = async (e) => {
      // console.log('files selected', e.target.files);
      let items = e.target.files;
      await this.handleUpload(e);
    };
  });

  $('.upload-directory').on('click', async (e) => {
    // console.log('upload directory clicked');
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = true;
    input.directory = true;
    input.click();

    input.onchange = async (e) => {
      // console.log('files selected', e.target.files);
      let items = e.target.files;
      await this.handleUpload(e);
    };
  });

  $('.refresh-files').on('click', async (e) => {
    await this.refreshFileTree();
  });


}