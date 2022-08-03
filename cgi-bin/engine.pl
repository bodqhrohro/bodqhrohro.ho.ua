#!/usr/bin/perl
use strict;
use warnings;
use v5.10;

use CGI ':cgi', ':cgi-lib';
use URI::Escape;
use POSIX 'strftime';

sub ReadTextFile {
	my $TF;
	open(TF, $_[0]);
	my $content;
	{
		local $/;
		$content = <TF>;
	}
	close(TF);
	return $content;
};

sub ExecHTPL {
	my $EPres = '';
	state $FIN = 'FIN'; # TODO: make random
	state $chomp = "\nchomp \$EPres;";
	my $text_ = "\$EPres = <<$FIN;\n$_[0]\n$FIN$chomp";
	$text_ =~ s/<\?=(.+?)\?>/\n$FIN$chomp\n\$EPres \.= \($1\) \. <<$FIN;\n/gms;
	$text_ =~ s/<\?/\n$FIN$chomp\n/g;
	$text_ =~ s/\?>/\n\$EPres \.= <<$FIN;\n/g;
	eval($text_);
	$EPres = "Error: $@" if $@;
	return $EPres;
};

# UTILS 

sub block {
	my $name = shift @_;
	return ExecHTPL(ReadTextFile($main::root_dir . '/_blocks/' . $name . '.htpl'), @_);
};

sub cookie_or_get {
	my $name = $_[0];
	my $use_cookies = cookie(-name=>'use_cookies');
	return $use_cookies == 1 ? cookie(-name=>$name) : url_param($name);
};

sub loc {
	return $_[0]->{common} // $_[0]->{$main::lang};
};

sub llink { # local link
	my $link = shift @_;
	return alink($main::root_dir_url . '/' . $link, @_);
};

sub alink { # absolute link
	my %params = Vars();
	if (defined($_[1])) {
		my $arg_params = $_[1];
		for my $key (keys %{$arg_params}) {
			$params{$key} = $arg_params->{$key};
		}
	}
	if (defined($_[2])) {
		my @exclude = @{$_[2]};
		for my $key (@exclude) {
			delete $params{$key};
		}
	}
	my $query_string = join('&', map { uri_escape($_) . '=' . uri_escape($params{$_}) } keys %params);
	$query_string = '?' . $query_string if $query_string ne '';
	return $_[0] . $query_string;
};

sub current_page {
	my $path = path_info();
	if (index($path, $main::root_dir_url) == 0) {
		$path = substr($path, length($main::root_dir_url));
	}
	$path =~ s!^/!!;
	return $path;
}

sub canonical_url {
	return alink(url( -path_info=>1 ), {}, @main::known_cookie_keys);
};

# CONSTANTS

{
	no warnings 'once';
	$main::fn = $ENV{'DOCUMENT_ROOT'} . $ENV{'PATH_INFO'};
	$main::known_stable_keys = [ 'lang' ];
	$main::known_cookie_keys = [ 'theme' ];
	$main::languages = [ 'ua', 'en', 'ru' ];
	$main::modification_time = (stat $main::fn)[9];
}

# MAIN

$main::root_dir_url = '';
$main::root_dir = $ENV{'DOCUMENT_ROOT'} . $main::root_dir_url;

$main::lang = (url_param('lang') or '');
if (! grep {$_ eq $main::lang} @{$main::languages}) {
	$main::lang = 'ua';
}
$main::inject_headers = {};

# execute the template first so sending headers like redirects is possible
my $templ_ = ReadTextFile($main::fn);

my $htpl = ExecHTPL($templ_);

$main::inject_headers->{-type} = 'text/html';
$main::inject_headers->{-charset} = 'utf-8';
print header $main::inject_headers;

print $htpl;
