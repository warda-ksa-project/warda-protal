export interface IDialog {
  props: {
      header?:string;
      visible: boolean;
      styles?: { [klass: string]: any } | null;
  };
  onHide: (e?: Event) => void;
  onShow: (e?: Event) => void;
}
