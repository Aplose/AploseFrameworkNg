


  
export interface GoogleButtonOptions{
    type: 'standard' | 'icon'
    theme: 'outline' | 'filled_blue' | 'filled_black'
    size: 'large' | 'medium' | 'small'
    text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
    shape: 'rectangular' | 'pill' | 'circle' | 'square'
    logo_alignement: 'left' | 'center'
    width: string
    locale: string
    click_listener: ()=>void
    state: string
}